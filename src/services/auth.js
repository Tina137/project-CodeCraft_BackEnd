import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

import { UsersCollection } from '../db/models/user.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import { getEnvVar } from '../utils/getEnvVar.js';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMPLATES_DIR } from '../constants/index.js';
