//all random geometry functions go in here

export class GeometryStuff {

  N; D; faces; vertices; faceCenters;

  constructor() {
    //nothing to do  yet
  }

  computeFaceCenters() {

    const {N,D,faces,vertices} = this;  //i get tired of typing "this"
    const faceCenters = [];
    for (let i=0; i<this.faces.length;i++) {  //for each face

      const vtx = Array(D).fill(0); //average all vertices in face

      for (let j=0; j<N; j++) {  // for each vertex of face
        const index = faces[i][j]-1;  // the vertex number
        const faceVtx = vertices[index]; //finally the actual vertex
        //console.log(faceVtx);
        for (let k=0; k<D; k++) {  // for each dimension of vertex
          vtx[k] += faceVtx[k]/N; //divide by N here so we don't need another loop    
        }
      }  
      
      faceCenters.push(vtx);  //save the face center finally
      
    }

    this.faceCenters = faceCenters;

    //faceCenters.map(x=>console.log(x));

  }

}