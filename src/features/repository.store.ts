import {createEvent, createStore, guard} from 'effector';
import {defaultRepo} from '../config';
import {createGate} from 'effector-react';

export type TRepo = typeof defaultRepo;

export const updateRepo = createEvent<TRepo>();

export const $repository = createStore<TRepo>({ name: '',  org: '' })

export const repoGate = createGate<TRepo>('repo gate')


$repository.on(updateRepo, (state, payload) => payload)

guard({
  source: repoGate.state,
  filter: repo => Object.values(repo).every(Boolean),
  target: updateRepo
})