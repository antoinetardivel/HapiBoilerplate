import { Boom, notFound } from '@hapi/boom';
import { ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { Element, elementModel } from './types';
import { IRequest } from '../../interfaces/request';

export class ElementsController {
  async createElement(req: IRequest, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      const elementPayload = req.payload as Element;

      const element = await elementModel.create<Element>(elementPayload);

      return h.response({ elementId: element._id }).code(201);
    } catch (err) {
      console.error('Error during creation ', err);
      return h.response(err).code(500);
    }
  }

  async getElements(req: IRequest, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      if (req.params.id) {
        const element = await elementModel.findById(req.params.id).lean({ autopopulate: true });

        if (!element) return notFound("Element doesn't exist.");

        return h.response(element);
      }

      const elements = await elementModel.find().lean({ autopopulate: true });

      if (!elements) return notFound("Elements doesn't exist.");

      return h.response(elements);
    } catch (err) {
      console.error('Error during process ', err);
      return h.response(err).code(500);
    }
  }

  async updateElement(req: IRequest, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      const elementPayload = req.payload as Element;

      const element = await elementModel
        .findById(req.params.id, { name: 1, description: 1 })
        .lean();
      if (!element) return notFound("Element doesn't exist.");

      await elementModel.updateOne({ _id: element._id }, { ...elementPayload, id: element._id });

      return h.response({ elementId: element._id }).code(201);
    } catch (err) {
      console.error('Error during update ', err);
      return h.response(err).code(500);
    }
  }

  async deleteElement(req: IRequest, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      await elementModel.deleteOne({ _id: req.params.id });
      return h.response().code(204);
    } catch (err) {
      console.error('Error during deletion ', err);
      return h.response(err).code(500);
    }
  }
}
