const { InputHints } = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');
const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog, NumberPrompt } = require('botbuilder-dialogs');
const { AuthUser } = require('./authUser.js');
const { StatusChamado } = require('./statusChamado.js');
const { TrocaPagamento } = require('./trocaPagamento.js');
const msgs = require('../bots/resources/welcomecard.js');

const AUTH_USER = 'authUser';
const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const STATUS_CHAMADO = 'statusChamado';
const TROCA_PAGAMENTO = 'trocaPagamento';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const WELCOMED_USER = 'welcomedUserProperty';
const TEXT_PROMPT = 'TextPrompt';

class MainDialog extends ComponentDialog {
    constructor(luisRecognizer, userState) {
        super('MainDialog');
        this.userState = userState;
        if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');
        this.luisRecognizer = luisRecognizer;

        this.addDialog(new NumberPrompt(NUMBER_PROMPT))
            .addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new AuthUser(AUTH_USER, userState, luisRecognizer))
            .addDialog(new TrocaPagamento(TROCA_PAGAMENTO, userState, luisRecognizer))
            .addDialog(new StatusChamado(STATUS_CHAMADO, userState, luisRecognizer))
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
        this.welcomedUserProperty = this.userState.createProperty(WELCOMED_USER);
        const userData = await this.welcomedUserProperty.get(stepContext.context, { welcomedUserProperty: false });
        if (!this.luisRecognizer.isConfigured) {
            const messageText = 'NOTE: LUIS is not configured. To enable all capabilities, add `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName` to the .env file.';
            await stepContext.context.sendActivity(messageText, null, InputHints.IgnoringInput);
            return stepContext.next();
        }
        if (!userData.welcomedUserProperty) {
            await stepContext.context.sendActivity(msgs.welcomeMessages.welcomeMessage);
            await this.welcomedUserProperty.set(stepContext.context, true);
            await this.userState.saveChanges(stepContext.context);
            return stepContext.beginDialog(AUTH_USER);
        } else {
            await stepContext.context.sendActivity(msgs.welcomeMessages.ola);
            return stepContext.next();
        }
    }

    async actStep(stepContext) {
        // this.usuario = this.userState.createProperty('usuario');
        // const autenticado = this.usuario.get(stepContext.context, false);
        // if (!autenticado) {
        //     return stepContext.cancelAllDialogs();
        // }
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
        if (luisResult.entities.Number) {
            if (luisResult.entities.Number === 1) {
                return stepContext.replaceDialog('trocaPagamento');
            } else if (luisResult.entities.Number === 2) {
                return stepContext.replaceDialog('statusChamado');
            }
        } else {
            switch (LuisRecognizer.topIntent(luisResult)) {
            case 'TrocaPagamento': {
                return stepContext.replaceDialog('trocaPagamento');
            }

            case 'StatusChamado': {
                return stepContext.replaceDialog('statusChamado');
            }

            default: {
                return stepContext.prompt(TEXT_PROMPT, msgs.welcomeMessages.didntUnderstandMessageText);
            }
            }
        }
    }

    async finalStep(stepContext) {
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
        if (luisResult.entities.Number) {
            if (luisResult.entities.Number === 1) {
                return stepContext.replaceDialog('trocaPagamento');
            } else if (luisResult.entities.Number === 2) {
                return stepContext.replaceDialog('statusChamado');
            }
        } else {
            switch (LuisRecognizer.topIntent(luisResult)) {
            case 'TrocaPagamento': {
                return stepContext.replaceDialog('trocaPagamento');
            }

            case 'StatusChamado': {
                return stepContext.replaceDialog('statusChamado');
            }

            default: {
                return stepContext.cancelAllDialogs();
            }
            }
        }
    }
}

module.exports = {
    MainDialog
};
