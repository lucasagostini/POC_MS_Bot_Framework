const { DialogBot } = require('./dialogBot');
const WelcomeCard = require('./resources/welcomecard.js');
const CONVERSATION_DATA_PROPERTY = 'conversationData';
const WELCOMED_USER = 'welcomedUserProperty';

class DialogAndWelcomeBot extends DialogBot {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);
        this.conversationDataAccessor = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);
        this.userState = userState;
        this.conversationState = conversationState;
        this.onMembersAdded(async (context, next) => {
            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);

            if (!didBotWelcomedUser) {
                await context.sendActivity(WelcomeCard.welcomeMessages.welcomeMessage);
                await this.welcomedUserProperty.set(context, true);
                this.conversationDataAccessor.promptedForAuth = true;
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
