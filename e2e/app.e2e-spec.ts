import { ProjetMaterialPage } from './app.po';

describe('projet-material App', () => {
  let page: ProjetMaterialPage;

  beforeEach(() => {
    page = new ProjetMaterialPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
