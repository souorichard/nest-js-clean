import { Slug } from './slug'

it('should be able to create a new slug from text', async () => {
  const slug = Slug.createFromText('Exmaple question title')

  expect(slug.value).toEqual('exmaple-question-title')
})
