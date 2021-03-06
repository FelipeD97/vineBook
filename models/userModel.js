const db = require("./conn"),
bcrypt = require("bcryptjs");

class User {
    constructor (first_name, last_name, email, password, company, role) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.company = company;
        this.role = role;
    }

    checkPassword(hashedPassword) {
        return bcrypt.compareSync(this.password, hashedPassword);
    }

    async login() {
        try {
            const response = await db.one(
                `SELECT 
                    id, 
                    first_name, 
                    last_name, 
                    company,
                    password,
                    role
                    FROM users WHERE email = $1;`, 
            [this.email]);


            const isValid = this.checkPassword(response.password);

            if (!!isValid) {
                const { id, first_name, last_name, role } = response;
                return { isValid, id, first_name, last_name, role };
            } else {
                return { isValid };
            }

        } catch(err) {
            return err.message;
        }
    }

    async save() {
        try {
            const response = await db.one(`INSERT INTO users 
                (first_name, last_name, company, email, password, role) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING id;`, 
                [this.first_name, this.last_name, this.company, this.email, this.password, this.role]);
            
            return response;
        }catch(err) {
            return err.message;
        }
    }
    static async getById(id) {
        try{
            const response = await db.one(
                `SELECT * FROM users WHERE id = ${id};`
            );
            
            return response
        }catch(err){
            return err.message;
        }
    }
}

module.exports = User;