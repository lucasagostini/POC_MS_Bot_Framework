// const { LuisRecognizer, LuisBotComponent, LuisAdaptiveRecognizer } = require('botbuilder-ai');
const { ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
// const { isEntity } = require('botframework-schema');
// const { DateResolverDialog } = require('./dateResolverDialog');
const messagesAuth = require('./resources/fluxoInicial');

const USER_AUTH = 'authUser';

class AuthUser extends ComponentDialog {
    constructor(id) {
        super(id || USER_AUTH);
        this.addDialog(new WaterfallDialog(USER_AUTH, [
            this.initialStep.bind(this),
            this.middleStep.bind(this),
            this.finalStep(this)
        ]));

        this.initialDialogId = USER_AUTH;
    }

    async initialStep(stepContext) {
        await stepContext.context.sendActivity(messagesAuth.informaDoc);
        if (searchAuth()) {
            await stepContext.context.sendActivity(messagesAuth.encontrei);
        } else {
            await stepContext.context.sendActivity(messagesAuth.naoEncontrei);
            await stepContext.context.sendActivity(messagesAuth.jaCliente);
            if (sim) {
                await stepContext.context.sendActivity(messagesAuth.informaDocNovamente);
                if (searchAuth()) {
                    await stepContext.context.sendActivity(messagesAuth.encontrei);
                } else {
                    await stepContext.context.sendActivity(messagesAuth.naoEncontreiFinal);
                    await stepContext.endDialog();
                }
            } else {
                await stepContext.context.sendActivity(messagesAuth.querParceiro);
                if (sim) {
                    await stepContext.context.sendActivity(messagesAuth.queNoticiaBoa);
                } else {
                    await stepContext.context.sendActivity(messagesAuth.quePena);
                }
                return stepContext.endDialog();
            }
        }
        return stepContext.cancelAllDialogs();
    }
}

module.exports.AuthUser = AuthUser;
