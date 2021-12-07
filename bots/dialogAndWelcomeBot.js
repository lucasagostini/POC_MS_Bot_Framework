const { DialogBot } = require('./dialogBot');
const WelcomeCard = require('./resources/welcomecard.js');

const WELCOMED_USER = 'welcomedUserProperty';
let welcomedUserProperty = null;
class DialogAndWelcomeBot extends DialogBot {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);
        this.userState = userState;

        this.onMembersAdded(async (context, next) => {
            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);

            if (!didBotWelcomedUser) {
                await context.sendActivity(WelcomeCard.welcomeMessages.welcomeMessage);
                await this.welcomedUserProperty.set(context, true);
                welcomedUserProperty = true;
            } else {
                await context.sendActivity(WelcomeCard.welcomeMessages.ola);
            }
            await dialog.run(context, conversationState.createProperty('DialogState'));
            await next();
        });
    }
}

module.exports = {
    DialogAndWelcomeBot,
    welcomedUserProperty
};
