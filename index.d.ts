declare module "config-env-file" {
  export declare interface Options {
    /** destination path to env file
     * @example ```js
     * await configEnvFile("config.json", {destination:"my-app"})
     * // env file written to my-app/.env.local
     * ```
     * @default "." */
    destination?: string;
    /**
     * whether to include object values or not
     * @default false
     */
    includeObjects?: boolean;
    /**
     * whether to add quotes or not
     * @default false
     */
    noQuotes?: boolean;
    /** extension to env file name
     * @example
     * ```js
     * await configEnvFile("config.json", {extension:"prod"})
     * // filename: .env.prod
     * ```
     * @default "local" */
    extension?: string;
    /** prefix to variables name
     * @example
     * ```js
     * await configEnvFile("config.json", {prefix:"my_app"})
     * // env variables will be written with the prefix my_app
     * ```
     * @default null */
    prefix?: string;
    /**
     * whether to use single quotes or not
     * @default false
     */
    singleQuotes?: boolean;
  }

  export declare const configEnvFile: (file: string, options?: Options) => Promise<void>;
}
