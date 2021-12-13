// const Math = require('math');
class UserService {
    constructor() {
        this.listaUsuarios = [
            new User(
                '12345678901',
                20211207,
                1,
                'Alteração de Dados',
                'Em Andamento',
                20211209),
            new User(
                '12345678902',
                20211205,
                2,
                'Alteração de Dados',
                'Em Andamento',
                20211207
            ),
            new User(
                '12345678903'
            )
        ];
    }

    getUser(document) {
        for (let i = 0; i < this.listaUsuarios.length; i++) {
            if (this.listaUsuarios[i].documento === document.toString()) {
                return this.listaUsuarios[i];
            }
        }
        return null;
    }

    addTicket(usuario) {
        const date = new Date();
        const mes = date.getMonth() + 1;
        const res = date.getDate() + 2;
        const ticketData = date.getFullYear().toString() + mes.toString() + date.getDate().toString();
        const ticketRes = date.getFullYear().toString() + mes.toString() + res.toString();
        usuario.ticketData = ticketData;
        usuario.ticketNumber = ticketData + Math.floor(Math.random() * (25 - 1) + 1).toString();
        usuario.ticketRes = ticketRes;
        usuario.ticketStat = 'Aberto';
        usuario.ticketType = 'Troca de Pagamento';
        return usuario.ticketNumber;
    }

    lateTicket(usuario) {
        let atrasado = false;
        if (usuario.ticketNumber) {
            const date = new Date();
            const mes = date.getMonth() + 1;
            const dia = date.getFullYear().toString() + mes.toString() + date.getDate().toString();
            if (usuario.ticketRes < dia) {
                atrasado = true;
            }
        }
        return atrasado;
    }

    hasTicket(usuario) {
        if (usuario.ticketNumber) {
            return true;
        }
        return false;
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
