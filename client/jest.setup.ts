import { TextEncoder, TextDecoder } from "util";
import fetchMock from 'jest-fetch-mock';

global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;


fetchMock.enableMocks();
