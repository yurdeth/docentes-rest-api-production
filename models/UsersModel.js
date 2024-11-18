import db from "../config/db.js";
import fs from "fs";
import {hashPassword} from "../utils/password-cryptor.js";

const Users = {
    getAll: async () => {
        const result = await db.query(
            `SELECT users.id,
                    users.name,
                    users.email,
                    users.career_id,
                    careers.career_name,
                    careers.department_id,
                    departments.department_name
             FROM users
                      INNER JOIN
                  careers ON users.career_id = careers.id
                      INNER JOIN
                  departments ON careers.department_id = departments.id`
        );
        return result.rows;
    },
    getAllEmails: async () => {
        const result = await db.query(
            `SELECT name, email FROM users`
        );
        return result.rows;
    },
    getById: async id => {
        const intId = parseInt(id, 10);
        if (isNaN(intId)) {
            throw new Error("Invalid ID format");
        }
        const result = await db.query(
            `SELECT users.id,
                    users.name,
                    users.email,
                    users.career_id,
                    careers.career_name,
                    careers.department_id,
                    departments.department_name
             FROM users
                      INNER JOIN
                  careers ON users.career_id = careers.id
                      INNER JOIN
                  departments ON careers.department_id = departments.id
             WHERE users.id = $1`, [intId]);
        return result.rows[0];
    },
    getByEmail: async (email) => {
        const result = await db.query(
            `SELECT users.id,
                users.name,
                users.email,
                users.password,
                users.career_id,
                careers.career_name,
                careers.department_id,
                departments.department_name,
                users.enabled
         FROM users
                  INNER JOIN
              careers ON users.career_id = careers.id
                  INNER JOIN
              departments ON careers.department_id = departments.id
         WHERE users.email = $1`, [email]
        );
        return result.rows[0];
    },
    doesEmailExists: async (email) => {
        const result = await db.query(
            `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`, [email]
        );
        return result.rows[0];
    },
    verifyUser: async (user) => {
        try {
            const result = await db.query(
                "SELECT * FROM users WHERE email = $1", [user]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error querying user:', error);
            throw error;
        }
    },
    enableUserStatus: async (id) => {
        try {
            const result = await db.query(
                "UPDATE users SET enabled = true WHERE id = $1", [id]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error updating user status:', err);
            throw err;
        }
    },
    disableUserStatus: async (id) => {
        try {
            const result = await db.query(
                "UPDATE users SET enabled = false WHERE id = $1", [id]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error updating user status:', err);
            throw err;
        }
    },
    initDepartmentsTable: async function () {
        return await db.query(
            `create table departments
                (
                    id              serial not null
                        constraint departments_pk primary key,
                    department_name varchar(50),
                    created_at      timestamp default now(),
                    updated_at      timestamp default now()
                );
            `
        );
    },
    initCareersTable: async function () {
        return await db.query(
            `create table careers
                (
                    id            serial not null
                        constraint careers_pk primary key,
                    career_name   varchar(100),
                    department_id int
                        constraint careers_department_id_foreign
                            references departments (id)
                            on update cascade on delete cascade,
                    created_at    timestamp default now(),
                    updated_at    timestamp default now()
                );
            `
        );
    },
    initUsersTable: async function () {
        return await db.query(
            `create table users
                (
                    id         serial not null
                        constraint users_pk primary key,
                    name       varchar(50),
                    email      varchar(50),
                    password   varchar(200),
                    career_id  int
                        constraint users_career_id_foreign
                            references careers (id)
                            on update cascade on delete cascade,
                    enabled    boolean   default false,
                    created_at timestamp default now(),
                    updated_at timestamp default now()
                );
            `
        );
    },
    initTables: async function () {
        await this.initDepartmentsTable();
        await this.initCareersTable();
        await this.initUsersTable();
    },
    initDepartments: async function () {
        const departments = fs.readFileSync('./departments.json', 'utf-8');
        const parsedDepartments = JSON.parse(departments).departments;
        const results = [];

        for (const department of parsedDepartments) {
            const result = await db.query("INSERT INTO departments (id, department_name) VALUES ($1, $2)",
                [department.id, department.department_name]
            );
            results.push(result);
        }

        return results;
    },
    initCareers: async function () {
        const careers = fs.readFileSync('./careers.json', 'utf-8');
        const parsedCareers = JSON.parse(careers).careers;
        const results = [];

        for (const career of parsedCareers) {
            const result = await db.query("INSERT INTO careers (id, career_name, department_id) VALUES ($1, $2, $3)",
                [career.id, career.career_name, career.department_id]
            );
            results.push(result);
        }

        return results;
    },
    initUsers: async function () {
        const users = fs.readFileSync('./users.json', 'utf-8');
        const parsedUsers = JSON.parse(users).users;
        const results = [];

        for (const user of parsedUsers) {
            const hashedPassword = await hashPassword(user.password);
            const result = await db.query("INSERT INTO users (id, name, email, password, career_id) VALUES ($1, $2, $3, $4, $5)",
                [user.id, user.name, user.email, hashedPassword, user.career_id]
            );
            results.push(result);
        }

        return results;
    },
    initData: async function () {
        await this.initDepartments();
        await this.initCareers();
        await this.initUsers();
    },
    init: async function () {
        await this.initTables();
        await this.initData();
    }
};

export default Users;
