module.exports = (sequelize, DataTypes) =>{
    return sequelize.define(
        "Santier",
        {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            nume:{
                type:DataTypes.STRING,
                allowNull: false
            },
            latitudine:{
                type: DataTypes.FLOAT,
                allowNull:false
            },
            longitudine:{
                type: DataTypes.FLOAT,
                allowNull:false
            },
            raza:{
                type: DataTypes.FLOAT,
                allowNull:false
            },
            localitate:{
                type: DataTypes.STRING,
                allowNull:false
            },
            judet:{
                type: DataTypes.STRING,
                allowNull:false
            },
            adresa:{
                type: DataTypes.STRING,
                allowNull:false
            }
        },
        {
            tableName:"Santier",
            timestamps: true
        }
    );
}
