class TicketService {
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

module.exports = {
    TicketService
};
