const { DialogBot } = require('./dialogBot');
const WelcomeCard = require('./resources/welcomecard.js');
const { AuthUser, searchAuth } = require('../dialogs/authUser.js');

const AUTH_USER = 'authUser';
const WELCOMED_USER = 'welcomedUserProperty';

class DialogAndWelcomeBot extends DialogBot {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);
        // como fazer isso?
        // this.addDialog(new AuthUser(AUTH_USER));
        this.userState = userState;

        this.onMembersAdded(async (context, next) => {
            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);

            if (!didBotWelcomedUser) {
                await context.sendActivity(WelcomeCard.welcomeMessages.welcomeMessage);
                // await this.beginDialog(AUTH_USER);
                await this.welcomedUserProperty.set(context, true);
            } else {
                await context.sendActivity(WelcomeCard.welcomeMessages.ola);
            }
            await dialog.run(context, conversationState.createProperty('DialogState'));
            await next();
        });
    }
}

module.exports.DialogAndWelcomeBot = DialogAndWelcomeBot;
