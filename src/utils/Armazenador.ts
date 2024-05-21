export class Armazenador {
    private constructor() {}

    static salvar(chave: string, valor: any): void {
        const valorComoString = JSON.stringify(valor);
        localStorage.setItem(chave, valorComoString);
    }

    // <T>: tipo genérico
    static obter<T>(chave: string, reviver?: (this: any, key: string, value: any) => any): T | null {
        const valor = localStorage.getItem(chave);

        if (valor === null) {
            return null;
        }

        if (reviver) {
            return JSON.parse(valor, reviver) as T;
        }

        return JSON.parse(valor) as T;
        // define explicitamente o tipo de retorno ao realizar a conversão de JSON para o tipo original
    }
}