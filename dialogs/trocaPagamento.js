// const { LuisRecognizer, LuisBotComponent, LuisAdaptiveRecognizer } = require('botbuilder-ai');
const { ConfirmPrompt, ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
// const { isEntity } = require('botframework-schema');
// const { DateResolverDialog } = require('./dateResolverDialog');
const messagesPay = require('../bots/resources/messagesPay.js');
const { ChangePayType } = require('./changePayType.js');
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
        const userTicket = hasTicket();
        if (userTicket) {
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.ticketAberto);
            await stepContext.context.sendActivity(messagesPay.messagesFluxo.chamado);
            if (userTicket.atrasado) {
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

function hasTicket() {
    //  to do struct que une usuario + atrasado
    var usuario = {
        ticket: {
            data: 1,
            numero: 202112061430
        },
        atrasado: false
    };

    // for (let i = 0; i < usuario.length; i++) {
    if (true) {
        // usuario = users[i];
        if (usuario.ticket.data < 2) {
            usuario.atrasado = true;
        }
    }
    // }
    return false;
}

module.exports.TrocaPagamento = TrocaPagamento;
