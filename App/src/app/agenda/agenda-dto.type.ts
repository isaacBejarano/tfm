import { Agenda } from '@agenda/agenda-model.type';

type AgendaPayload = Pick<Agenda, 'title'>;

type DtoAgenda = Agenda;

export type { AgendaPayload, DtoAgenda };
