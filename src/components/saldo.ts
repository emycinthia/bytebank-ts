import { formatarData, formatarMoeda } from "../utils/formatadores.js";
import { FormatoData } from "../types/FormatoData.js";
import Conta from "../types/Conta.js";

const elementSaldo = document.querySelector(".saldo-valor .valor") as HTMLElement;
const elementoData = document.querySelector(".block-saldo time") as HTMLElement;

if (elementoData != null) {
    elementoData.textContent = formatarData(Conta.getDataAcesso(), FormatoData.DIA_SEMANA_DIA_MES_ANO);
}

Renderizar();

function Renderizar(): void {   
    if (elementSaldo != null) {
        elementSaldo.textContent = formatarMoeda(Conta.getSaldo());
    }
}

const SaldoComponent = {
    atualizar() {
        Renderizar();
    }
}

export default SaldoComponent;