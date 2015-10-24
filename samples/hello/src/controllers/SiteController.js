import { newController } from 'alp';

export default newController({
    index: newController.action(async function(request, response) {
        const name = request.params.string('name').notEmpty().value;
        return response.end(this.t('Hello %s!', request.params.isValid() ? name : 'World'));
    }),
});
