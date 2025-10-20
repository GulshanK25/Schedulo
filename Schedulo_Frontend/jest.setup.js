import { TextEncoder, TextDecoder } from "util";

// Fix TextEncoder/TextDecoder not defined error
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
