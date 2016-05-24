(function() {
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController() {
        var self = this;
        self.calculate = calculate;
        self.onChange = onChange;
        self.headers = [1,2,3,4,5,6,7,8,9,10];
        self.content = [['minsk', 4,5,6,7,8,9,6,5,4,1,2],['brest', 4,5,6,7,8,9,6,5,4,1,2]];

        var repositoryArray = [];
        var result = [];


        function onChange(currentArray, index, aa) {
          result= [];
          repositoryArray=[];
          self.content.forEach(function(el) {
            if(el[0] === currentArray[0]) {
              el[index] = aa.va * 1;
            }

          });
        }

        function calculate() {
          result = [];
          var final = {}

          for(var i=1; i<self.content[0].length; i++) {
            console.log(i);
            var tempArray =[];
            self.content.forEach(function(subArray, index) {
              tempArray.push({city: subArray[0], val:subArray[i]});
            });
            tempArray.sort(function(a, b) {
              return a.val - b.val;
            })
            console.log(tempArray);
            for(var a=0; a< tempArray.length; a++) {
              tempArray[a].val = a;
            }
            repositoryArray.push(tempArray);
            console.log('repositoryArray',  repositoryArray);
          }


          for(var k =0; k<self.content.length; k++) {
            var cityName = self.content[k][0];
            console.log(cityName)
            var orderedArray = repositoryArray[k];
            var final ={};
            final.city = cityName;
            final.sum = 0;
            var sum = 0;
            for(var j=0; j<repositoryArray.length; j++) {
              repositoryArray[j].forEach(function(el){
                if(el.city ===cityName) {

                  sum +=el.val;
                }
              })
            }
            final.sum = sum;
            result.push(final);


          }

          console.log(result);
        }

    }
}());
