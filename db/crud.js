
class Crud {
    constructor (connection) {
        this.connection = connection
    }
    searchTable (obj) { // 搜索表名的语句
        var condition = obj.condition ? ' WHERE ' + obj.condition : ''
        var sql = `SELECT ${obj.key || '*'} FROM ${obj.table}` + condition
        console.log(sql)
        return this.run(sql)
    }
    
    createTable (name, options) {
        var str = ''
        var list = Object.keys(options)
        var len = list.length
        list.forEach(
            (key, index) => {
                if (key === 'primary') {
                    str += `PRIMARY KEY (${options[key]})`
                    return
                }
                str += key + ' ' + options[key] + (index !== (len - 1) ? ',\n' : '')
            }
        )
        var sql = ` CREATE TABLE IF NOT EXISTS ${name}
                    (
                        ${str}
                    ) ENGINE=InnoDB  DEFAULT CHARSET=utf8
        `
        return this.run(sql)
    }

    insert (name, obj) {
        var list = Object.keys(obj)
        var keys = list.join(',')
        var values = list.map(key => `"${obj[key]}"`).join(',')
        var sql = `
            INSERT INTO ${name} (${keys})
            VALUES (${values})
        `
        return this.run(sql)
    }
    
    insertList (name, arr) {
        arr.forEach(obj => this.insert(name, obj))
        console.log('批量插入完成')
    }
    
    update (tableName, options) {
        var keys = Object.keys(options)
        var keyValues = keys.map(key => {
            if (key !== 'condition') {
                return `${key}='${options[key]}'`
            }
        }).filter(x => x).join(',')
        var sql = `
            UPDATE ${tableName} 
            SET ${keyValues} 
            WHERE ${options.condition}
        `
        this.run(sql)
    }
    
    count (tableName) {
        var sql = `select count(*) from ${tableName}`
        return this.run(sql)
    }

    run (sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, function (error, results, fields) {
                if (error) throw error;
                if (results.length === 1) {
                    resolve(results[0])
                } else {
                    resolve(results)
                }
                
            })
        })
    }
    
    end () {
        this.connection.end()
    }
}

module.exports = Crud