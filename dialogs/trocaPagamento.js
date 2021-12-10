const { ConfirmPrompt, ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
const messagesPay = require('../bots/resources/messagesPay.js');
const { ChangePayType } = require('./changePayType.js');
// const { index } = require('./authUser.js');

const CONFIRM_PROMPT = 'confirmPrompt';
const TROCA_PAGAMENTO = 'trocaPagamento';
const CHANGE_PAY = 'changePayType';

class TrocaPagamento extends ComponentDialog {
    constructor(id) {
        super(id || TROCA_PAGAMENTO);
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new ChangePayType(CHANGE_PAY))
            .addDialog(new WaterfallDialog(TROCA_PAGAMENTO, [
                this.initialStep.bind(this),
                this.ticketOpened.bind(this),
                this.needHelp.bind(this)
            ]));

        this.initialDialogId = TROCA_PAGAMENTO;
    }

    async initialStep(stepContext) {
        // pegar intent e informações da mensagem inicial
        return stepContext.next();
    }

    async ticketOpened(stepContext) {
        // TODO consumir do user state
        const atrasado = hasTicket(stepContext.values.listaUsuarios);
        const index = 2;
        if (stepContext.values.listaUsuarios[index].ticketNumber) {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.ticketAberto);
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.chamado);
            if (atrasado) {
                await stepContext.context.sendActivity(messagesPay.messagesFluxo.atrasado);
            } return stepContext.prompt(CONFIRM_PROMPT, messagesPay.messagesFluxo.ajudaSolicitacao, ['Sim', 'Não']);
        } else {
            return stepContext.replaceDialog(CHANGE_PAY);
        }
    }

    async needHelp(stepContext) {
        if (stepContext.result) {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.resolverSolicitacao);
        } else {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.tudoBem);
        }
        return stepContext.endDialog();
    }
}

function hasTicket(listaUsuarios) {
    let atrasado = false;
    const index = 2;
    if (listaUsuarios[index].ticketNumber) {
        const date = new Date();
        const mes = date.getMonth() + 1;
        const dia = date.getFullYear().toString() + mes.toString() + date.getDate().toString();
        if (listaUsuarios[index].ticketRes < dia) {
            atrasado = true;
        }
    }
    return atrasado;
}

module.exports.TrocaPagamento = TrocaPagamento;
