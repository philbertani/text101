
export class alphabetData {

  langMap = {"ENGLISH":"ENGLISH"};
  letters = {};
  constructor() {
    this.letters["ENGLISH"] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  }
  get(language) {
    return this.letters[ this.langMap[String(language).toUpperCase()] ];
  }
}


