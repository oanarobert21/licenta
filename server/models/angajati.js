module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Angajati", 
        {
            idAngajat: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
        nume:{
            type:DataTypes.STRING,
            allowNull:false
        },
        prenume:{
            type:DataTypes.STRING,
            allowNull:false
        },
        cnp:{
            type:DataTypes.STRING,
            allowNull:false,
            unique: true
        },
        dataAngajare:{
            type:DataTypes.DATE,
            allowNull:false
        },
        numarTelefon: {
            type:DataTypes.INTEGER,
            allowNull:false
        },
        isAdmin:{
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },
        parola:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false
        },
        token:{
            type:DataTypes.STRING,
            allowNull:true
        }
    },
        {
            tableName:"Angajati",
            timestamps: true,
        }
    );

}