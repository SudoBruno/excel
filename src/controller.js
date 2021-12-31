const connection = require('./database/connection');

module.exports = {
    async handle() {
        console.time('someFunction')

        //const initialDate = format((new Date()-120), "yyyy-MM-dd 00:00:00");
        const initialDate = "2021-06-01 00:00:00"
        //console.log ("Rodou.....")


        try {
            const input = await connection('expedition_input')
                .select(connection.raw('MONTH(expedition_input.created_at) as mesEntrada'))
                .select(connection.raw('YEAR(expedition_input.created_at) as anoEntrada'))
                .select(
                    'production_line.name as line',
                    'product.reference as codForn')
                .join('bar_code', 'bar_code.id', '=', 'expedition_input.bar_code_id')
                .join('product', 'product.id', '=', 'bar_code.product_id')
                .join('production_plan_control', 'production_plan_control.id', '=', 'bar_code.production_plan_control_id')
                .join('production_line', 'production_line.id', '=', 'production_plan_control.production_line_id')
                .where('expedition_input.created_at', '>', initialDate)
                .groupBy('bar_code.code')



            return input;
        } catch (error) {
            console.log(error);
            return error;
        }


    }
}