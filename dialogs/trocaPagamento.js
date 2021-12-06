// const { LuisRecognizer, LuisBotComponent, LuisAdaptiveRecognizer } = require('botbuilder-ai');
const { ConfirmPrompt, ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
// const { isEntity } = require('botframework-schema');
// const { DateResolverDialog } = require('./dateResolverDialog');
// const messagesPay = require('./resources/trocaPagamento');
const CONFIRM_PROMPT = 'confirmPrompt';
const TROCA_PAGAMENTO = 'trocaPagamento';

class TrocaPagamento extends ComponentDialog {
    constructor(id) {
        super(id || TROCA_PAGAMENTO);
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(TROCA_PAGAMENTO, [
                this.initialStep.bind(this),
                this.ticketOpened(this),
                this.changePayType(this),
                this.toOpenTicket(this),
                this.checkDate(this)
            ]));

        this.initialDialogId = TROCA_PAGAMENTO;
    }

    async initialStep(stepContext) {
        // pegar intent e informações da mensagem inicial
        await stepContext.context.sendActivity('1!');
        return stepContext.next();
    }

    async ticketOpened(stepContext) {
        // implementar hasticket,ticketlate
        /*
        if (hasTicket()) {
            await stepContext.context.sendActivity(messagesPay.ticketOpen);
            await stepContext.context.sendActivity(messagesPay.chamado);
            if (ticketLate()) {
                await stepContext.context.sendActivity(messagesPay.ticketLate);
            } await stepContext.prompt(CONFIRM_PROMPT, messagesAuth.ajudaSolicitacao, ['Sim', 'Não']);
            if (stepContext.result) {
                await stepContext.context.sendActivity(messagesPay.resolverSolicitacao);
            } else{
                await stepContext.context.sendActivity(messagesPay.tudoBem);
            }
        } else {
            await stepContext.replaceDialog(changePayType);
        } */
        // await stepContext.context.sendActivity('2!');
        return stepContext.endDialog();
    }

    async changePayType(stepContext) {
        /* if (cheque | boleto | dinheiro) {
            await stepContext.context.sendActivity(messagesPay.formaInformada);
            await stepContext.replaceDialog(this.checkDate);
        } else {
            await stepContext.context.sendActivity(messagesPay.formaNaoInformada);
            if (cheque | boleto | dinheiro) {
                await stepContext.replaceDialog(this.checkDate);
            } else {
                if (cartao) {
                    await stepContext.context.sendActivity(messagesPay.naoCartao);
                    await stepContext.context.sendActivity(messagesPay.formasValidas);
                    if (cartao) {
                        await stepContext.context.sendActivity(messagesPay.naoNaoCartao);
                        await stepContext.endDialog();
                    }
                    if (cheque | boleto | dinheiro | 1 | 2 | 3) {
                        await stepContext.replaceDialog(this.checkDate);
                    }
                }
            }
        } */
        // await stepContext.context.sendActivity('3!');
        return stepContext.endDialog();
    }

    async toOpenTicket(stepContext) {
        /* await stepContext.context.sendActivity(messagesPay.abrindoChamado);
        if (abrirChamado()) {
            await stepContext.context.sendActivity(messagesPay.abriuChamado);
        } else {
            await stepContext.context.sendActivity(messagesPay.naoAbriuChamado);
        } */
        return stepContext.endDialog();
    }

    async checkDate(stepContext) {
        /* if (data) {
            await stepContext.replaceDialog(this.toOpenTicket);
        } else {
            await stepContext.context.sendActivity(messagesPay.qualPrazo);
            if (prazo >= 8) {
                await stepContext.context.sendActivity(messagesPay.prazoInvalido);
                if (prazo >= 8) {
                    await stepContext.context.sendActivity(messagesPay.prazoImpossivel);
                    await stepContext.endDialog();
                } else {
                    await stepContext.replaceDialog(this.toOpenTicket);
                }
            } else {
                await stepContext.replaceDialog(this.toOpenTicket);
            }
        } */
        return stepContext.endDialog();
    }
}

module.exports.TrocaPagamento = TrocaPagamento;
