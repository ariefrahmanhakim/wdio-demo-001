export class sessionVariable {
    private static variables = new Map<string, any>();

    static set(key: string, value: any): void {
        this.variables.set(key, value);
    }

    static get<T>(key: string): T | undefined {
        return this.variables.get(key);
    }

    static clear(): void {
        this.variables.clear();
    }
}