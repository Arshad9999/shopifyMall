import React from 'react';
declare type ComponentModule<P = {}> = {
    default: React.ComponentType<P>;
};
export declare type LoaderComponent<P = {}> = Promise<React.ComponentType<P> | ComponentModule<P>>;
export declare type Loader<P = {}> = (() => LoaderComponent<P>) | LoaderComponent<P>;
export declare type LoaderMap = {
    [module: string]: () => Loader<any>;
};
export declare type LoadableGeneratedOptions = {
    webpack?(): any;
    modules?(): LoaderMap;
};
export declare type DynamicOptionsLoadingProps = {
    error?: Error | null;
    isLoading?: boolean;
    pastDelay?: boolean;
    retry?: () => void;
    timedOut?: boolean;
};
export declare type DynamicOptions<P = {}> = LoadableGeneratedOptions & {
    loading?: (loadingProps: DynamicOptionsLoadingProps) => JSX.Element | null;
    loader?: Loader<P> | LoaderMap;
    loadableGenerated?: LoadableGeneratedOptions;
    ssr?: boolean;
    /**
     * @deprecated `suspense` prop is not required anymore
     */
    suspense?: boolean;
};
export declare type LoadableOptions<P = {}> = DynamicOptions<P>;
export declare type LoadableFn<P = {}> = (opts: LoadableOptions<P>) => React.ComponentType<P>;
export declare type LoadableComponent<P = {}> = React.ComponentType<P>;
export default function dynamic<P = {}>(dynamicOptions: DynamicOptions<P> | Loader<P>, options?: DynamicOptions<P>): React.ComponentType<P>;
export {};
