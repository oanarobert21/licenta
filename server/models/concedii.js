module.exports =(sequelize, DataTypes) => {
    return sequelize.define(
        "Concedii",
        {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            dataInceput:{
                type:DataTypes.DATE,
                allowNull: false
            },
            dataSfarsit:{
                type:DataTypes.DATE,
                allowNull: false
            },
            motiv:{
                type:DataTypes.STRING,
                allowNull: false 
            },
            status:{
                type: DataTypes.ENUM ({
                    values: ['În așteptare', 'Acceptat', 'Respins']
                  })
            },
        },
            {
                tableName:"Concedii",
                timestamps:true
            }

    );
}