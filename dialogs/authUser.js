// const { LuisRecognizer, LuisBotComponent, LuisAdaptiveRecognizer } = require('botbuilder-ai');
// const { UserState } = require('botbuilder-core');
const { ComponentDialog, WaterfallDialog, ConfirmPrompt } = require('botbuilder-dialogs');
// const { isEntity } = require('botframework-schema');
// const { DateResolverDialog } = require('./dateResolverDialog');
const messagesAuth = require('./resources/fluxoInicial');
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const USER_AUTH = 'authUser';

class AuthUser extends ComponentDialog {
    constructor(id) {
        super(id || USER_AUTH);
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
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
            await stepContext.prompt(CONFIRM_PROMPT, messagesAuth.jaCliente, ['Sim', 'Não']);
            if (stepContext.result) {
                await stepContext.context.sendActivity(messagesAuth.informaDocNovamente);
                if (searchAuth()) {
                    await stepContext.context.sendActivity(messagesAuth.encontrei);
                } else {
                    await stepContext.context.sendActivity(messagesAuth.naoEncontreiFinal);
                    await stepContext.endDialog();
                }
            } else {
                await stepContext.prompt(CONFIRM_PROMPT, messagesAuth.querParceiro, ['Sim', 'Não']);
                if (stepContext.result) {
                    await stepContext.context.sendActivity(messagesAuth.queNoticiaBoa);
                } else {
                    await stepContext.context.sendActivity(messagesAuth.quePena);
                }
                return stepContext.endDialog();
            }
        }
        return stepContext.next();
    }
}
// to do criar struct e passar como parametro
function searchAuth(users) {
    for (let i = 0; i < users.lenght; i++) {
        if (users[i].ticket) {
            return users[i].ticket;
        }
    }
    return false;
}
module.exports.AuthUser = AuthUser;
module.exports.SearchAuth = searchAuth;
