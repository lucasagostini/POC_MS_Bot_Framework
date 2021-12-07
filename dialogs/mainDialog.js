const { InputHints } = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');
const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { StatusChamado } = require('./statusChamado.js');
const { TrocaPagamento } = require('./trocaPagamento.js');

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const STATUS_CHAMADO = 'statusChamado';
const TROCA_PAGAMENTO = 'trocaPagamento';

function Users(documento, ticketData, ticketNumber, ticketType, ticketStat, ticketRes) {
    this.documento = documento;
    this.ticketData = ticketData;
    this.ticketNumber = ticketNumber;
    this.ticketType = ticketType;
    this.ticketStat = ticketStat;
    this.ticketRes = ticketRes;
}
const listaUsuarios = [
    new Users(
        '01234567890',
        20211207,
        1,
        'Alteração de Dados',
        'Em Andamento',
        20211209),
    new Users(
        '01234567891',
        20211205,
        2,
        'Alteração de Dados',
        'Em Andamento',
        20211207
    ),
    new Users(
        '01234567892'
    )
];

class MainDialog extends ComponentDialog {
    constructor(luisRecognizer, bookingDialog) {
        super('MainDialog');

        if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');
        this.luisRecognizer = luisRecognizer;

        if (!bookingDialog) throw new Error('[MainDialog]: Missing parameter \'bookingDialog\' is required');

        this.addDialog(new TextPrompt('TextPrompt'))
            .addDialog(bookingDialog)
            .addDialog(new TrocaPagamento(TROCA_PAGAMENTO))
            .addDialog(new StatusChamado(STATUS_CHAMADO))
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.introStep.bind(this),
                this.actStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async introStep(stepContext) {
        if (!this.luisRecognizer.isConfigured) {
            const messageText = 'NOTE: LUIS is not configured. To enable all capabilities, add `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName` to the .env file.';
            await stepContext.context.sendActivity(messageText, null, InputHints.IgnoringInput);
            return stepContext.next();
        }

        return stepContext.prompt('TextPrompt');
    }

    async actStep(stepContext) {
        // Call LUIS and gather any potential booking details. (Note the TurnContext has the response to the prompt)
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
        switch (LuisRecognizer.topIntent(luisResult)) {
        case 'TrocaPagamento': {
            return stepContext.replaceDialog('trocaPagamento');
        }

        case 'StatusChamado': {
            return stepContext.replaceDialog('statusChamado');
        }

        default: {
            // Catch all for unhandled intents
            const didntUnderstandMessageText = `Como posso te ajudar?

            1 - Mudar forma de pagamento
            2 - Consultar o status de um chamado (intent was ${ LuisRecognizer.topIntent(luisResult) })`;
            await stepContext.context.sendActivity(didntUnderstandMessageText, didntUnderstandMessageText, InputHints.IgnoringInput);
            // fazer um IF de 1
            // fazer um IF de 2
            // else mensagem de desculpa
        }
            return stepContext.endDialog();
        }
    }
}

module.exports = {
    MainDialog,
    listaUsuarios
};
