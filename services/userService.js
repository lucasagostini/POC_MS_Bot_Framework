class UserService {
    constructor() {
        this.listaUsuarios = [
            new User(
                '91470841207',
                20211207,
                1,
                'Alteração de Dados',
                'Em Andamento',
                20211209),
            new User(
                '50254463843',
                20211205,
                2,
                'Alteração de Dados',
                'Em Andamento',
                20211207
            ),
            new User(
                '40865444153'
            )
        ];
    }
    // nao funcionando e não sei pq

    getUser(document) {
        this.listaUsuarios.find(elem => {
            if (elem.document === document) {
                return elem;
            }
        });
    }
}

class User {
    constructor(documento, ticketData, ticketNumber, ticketType, ticketStat, ticketRes) {
        this.documento = documento;
        this.ticketData = ticketData;
        this.ticketNumber = ticketNumber;
        this.ticketType = ticketType;
        this.ticketStat = ticketStat;
        this.ticketRes = ticketRes;
    }
}
module.exports = {
    UserService
};
