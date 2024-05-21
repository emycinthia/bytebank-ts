import { Armazenador } from "../utils/Armazenador.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { Transacao } from "./Transacao.js";

export class Conta {
    protected nome: string
    protected saldo: number = Armazenador.obter<number>("saldo") || 0;
    private transacoes: Transacao[] = Armazenador.obter<Transacao[]>(("transacoes"), (key: string, value: any) => {
        if (key === "data") {
            return new Date(value);
        }

        return value;
    }) || [];

    constructor(nome: string) {
        this.nome = nome;
    }

    public getTitular() {
        return this.nome;
    }

    getSaldo() {
        return this.saldo;
    }

    getDataAcesso(): Date {
        return new Date();
    }

    getGruposTransacoes(): GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = [];
        const listaTransacoes: Transacao[] = structuredClone(this.transacoes);
        const transacoesOrdenadas: Transacao[] = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao: string = "";

        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao: string = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" });

            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;

                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }

            gruposTransacoes[gruposTransacoes.length - 1].transacoes.push(transacao);
        }

        return gruposTransacoes;
    }

    registrarTransacao(novaTransacao: Transacao) : void {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            this.depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
            this.debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw new Error("Tipo de transação inválida");
        }

        this.transacoes.push(novaTransacao);
        console.log(this.getGruposTransacoes());
        Armazenador.salvar("transacoes", JSON.stringify(this.transacoes));
    }

    debitar(valor: number): void {
        if (valor <= 0) {
            throw new Error("O valor debitado deve ser maior que zero.");
        }
        if (valor > this.saldo) {
            throw new Error("Saldo insuficiente");
        }
    
        this.saldo -= valor;
        Armazenador.salvar("saldo", this.saldo.toString());
    }

    depositar(valor: number): void {
        if (valor <= 0) {
            throw new Error("O valor a ser depositado deve ser maior que zero.");
        }
    
        this.saldo += valor;
        Armazenador.salvar("saldo", this.saldo.toString());
    }
}

const conta = new Conta("Joana da Silva Oliveira");

export default conta;