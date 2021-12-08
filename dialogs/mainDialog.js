const { InputHints } = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');
const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog, NumberPrompt } = require('botbuilder-dialogs');
const { AuthUser } = require('./authUser.js');
const { StatusChamado } = require('./statusChamado.js');
const { TrocaPagamento } = require('./trocaPagamento.js');
const { welcomedUserProperty } = require('../bots/dialogAndWelcomeBot.js');

const AUTH_USER = 'authUser';
const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const STATUS_CHAMADO = 'statusChamado';
const TROCA_PAGAMENTO = 'trocaPagamento';
const NUMBER_PROMPT = 'NUMBER_PROMPT';

class Users {
    constructor(documento, ticketData, ticketNumber, ticketType, ticketStat, ticketRes) {
        this.documento = documento;
        this.ticketData = ticketData;
        this.ticketNumber = ticketNumber;
        this.ticketType = ticketType;
        this.ticketStat = ticketStat;
        this.ticketRes = ticketRes;
    }
}
const listaUsuarios = [
    new Users(
        '12345678901',
        20211207,
        1,
        'Alteração de Dados',
        'Em Andamento',
        20211209),
    new Users(
        '12345678902',
        20211205,
        2,
        'Alteração de Dados',
        'Em Andamento',
        20211207
    ),
    new Users(
        '12345678903'
    )
];

class MainDialog extends ComponentDialog {
    constructor(luisRecognizer, bookingDialog) {
        super('MainDialog');

        if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');
        this.luisRecognizer = luisRecognizer;

        if (!bookingDialog) throw new Error('[MainDialog]: Missing parameter \'bookingDialog\' is required');

        this.addDialog(new NumberPrompt(NUMBER_PROMPT))
            .addDialog(new TextPrompt('TextPrompt'))
            .addDialog(bookingDialog)
            .addDialog(new AuthUser(AUTH_USER))
            .addDialog(new TrocaPagamento(TROCA_PAGAMENTO))
            .addDialog(new StatusChamado(STATUS_CHAMADO))
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.introStep.bind(this),
                this.actStep.bind(this),
                this.finalStep.bind(this)
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

        if (welcomedUserProperty) {
            return stepContext.next();
        } else {
            return stepContext.beginDialog(AUTH_USER, listaUsuarios);
        }
    }

    async actStep(stepContext) {
        // como salvar pra usar no changepaytype
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
        switch (LuisRecognizer.topIntent(luisResult)) {
        case 'TrocaPagamento': {
            return stepContext.replaceDialog('trocaPagamento', listaUsuarios);
        }

        case 'StatusChamado': {
            return stepContext.replaceDialog('statusChamado', listaUsuarios);
        }

        default: {
            // Catch all for unhandled intents
            const didntUnderstandMessageText = `Como posso te ajudar?

            1 - Mudar forma de pagamento
            2 - Consultar o status de um chamado (intent was ${ LuisRecognizer.topIntent(luisResult) })`;
            return stepContext.prompt(NUMBER_PROMPT, didntUnderstandMessageText, ['1', '2']);
        }
        }
    }

    async finalStep(stepContext) {
        if (stepContext.result === 1) {
            return stepContext.replaceDialog('trocaPagamento', listaUsuarios);
        }
        if (stepContext.result === 2) {
            return stepContext.replaceDialog('statusChamado', listaUsuarios);
        }
    }
}

module.exports = {
    MainDialog
};
