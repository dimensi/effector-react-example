import {createStore} from 'effector';
import {ErrorMessage} from '../api';

export const $error = createStore<ErrorMessage | null>(null)