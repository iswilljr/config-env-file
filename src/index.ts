import {readFile, writeFile} from 'fs/promises'
import {resolve} from 'path'
import {noCase as c} from 'no-case'

const constant = (s: string) => c(s, {delimiter: '_', transform: str => str.toUpperCase()})
const camel = (s: string) =>
	c(s, {delimiter: '', transform: (s, i) => (i === 0 ? s.toLowerCase() : `${s.charAt(0)}${s.slice(1).toLowerCase()}`)})

type Options = {
	destination?: string
	extension?: string
	prefix?: string
	env?: 'process' | 'import'
}

const getCfg = (c: object, p: string = '', t: 'file' | 'config' = 'file', e: 'process' | 'import' = 'process') => {
	const isF = t === 'file'
	const prefix = constant(p)
	return (
		Object.entries(c)
			.map(v => {
				const name = constant(v[0])
				const key = `${prefix && !name.includes(prefix) ? `${prefix}_` : ''}${name}`
				return isF ? `${key}=${v[1]}` : `${camel(name)}: ${e === 'process' ? 'process.env.' : 'import.meta.env.'}${key}`
			})
			.join(isF ? '\n' : ',\n ') + (isF ? '\n' : '')
	)
}

export const configEnvFile = async (file: string, options: Options = {}) => {
	const {destination: dest = '.', extension: ext = 'local', prefix, env} = options
	try {
		if (!file) throw new Error('File is required')
		if (env && !['process', 'import'].includes(env)) throw Error(`recived '${env}' expected 'process' or 'import'`)

		const cfgFile = JSON.parse(await readFile(resolve(file), 'utf8'))
		let cfg = Object.fromEntries(Object.entries(cfgFile).map(v => [constant(v[0]), v[1]]))

		await writeFile(resolve(dest, `.env.${ext}`), getCfg(cfg, prefix))
		console.log(`Check your .env.${ext}\nyour config:\nconst config = { \n ${getCfg(cfg, prefix, 'config', env)}\n}`)
	} catch (e: any) {
		console.error('error:', e.message)
	}
}
