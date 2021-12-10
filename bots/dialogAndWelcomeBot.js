const { DialogBot } = require('./dialogBot');
const WelcomeCard = require('./resources/welcomecard.js');
const WELCOMED_USER = 'welcomedUserProperty';

class DialogAndWelcomeBot extends DialogBot {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);

        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);

        this.onMembersAdded(async (context, next) => {
            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);
            if (!didBotWelcomedUser) {
                await context.sendActivity(WelcomeCard.welcomeMessages.welcomeMessage);
            } else {
                await context.sendActivity(WelcomeCard.welcomeMessages.ola);
            }
            await dialog.run(context, conversationState.createProperty('DialogState'));
            await next();
        });
    }
}

module.exports = {
    DialogAndWelcomeBot
};
