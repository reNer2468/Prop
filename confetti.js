/*

変更できる変数を挙げておきます。

CONFETTI_MAX:          紙吹雪の数を増やせます。

COLORS:                紙吹雪の色を変更できます。
                       色を追加するときは、「""」の中にカラーコードを記入した後に記号「,」を入れてください（記号はコピペするのが安全）
COLORS追加の例:         ["#f55","#55ff",]の中に#5c5(淡い緑)を入れたい。
                       このときは、["#f55","#55ff","#5c5"]と記入したあと、["#f55","#55ff","#5c5"]とすればOK。
COLORSの参照:           https://www.colordic.org/p

KEY_NUMBER:            デフォルトのKEY_NUMBER=32に設定しています。
                       これは、スペースを押すことで紙吹雪を降らせるか降らせないかのフラグ管理をしています。
                       すでに別の用途でスペースを使っている可能性もあるので適宜、32を変更してください。
KEY_NUMBERの参照:       https://web-designer.cman.jp/javascript_ref/keyboard/keycode/

document.bgColor:      背景画面の色を変えることができます。
                       (OBSの透過は基本的に緑だったはずなので、#00FF00に設定しています。)
                       #以降、6桁の数字がありますが、上2桁は赤色成分、中2桁は緑色成分、下2桁は青色成分を示しています
document.bgColorの参照: https://www.peko-step.com/tool/tfcolor.html
*/



/*変更してもOKなやつです。overflowにならない常識のある範囲でいじってください...対策してないんですぶっ壊れたら何が起きるか分からんです*/
const CONFETTI_MAX=400;
const COLORS=["#ff7f7f","#ff7fff","#7f7fff","#7fffff","#7fff7f","#ffff7f",];
document.bgColor="#00FF00";
const KEY_NUMBER=32;



/*内部処理です。下手に触るとぶっ壊れます、触らない！！*/
let screen_w=window.innerWidth;
let screen_h=window.innerHeight;
let init_tag_count=document.body.childElementCount;

function rand(min,max){
    return (Math.floor(Math.random()*(max-min+1)+min));
}

class Confetti{
    constructor(){
	this.elm=document.createElement("div");
	document.body.appendChild(this.elm);
	
	this.sty=this.elm.style;
	
	this.x=rand(0,screen_w);
	this.y=rand(-300,-15);

	this.vx=rand(-10,10);
	this.vy=rand(5,10);
	
	this.ang=0;
	this.spd=rand(30,50);

	this.rX=rand(0,10)/10;
	this.rY=rand(0,10)/10;
	this.rZ=rand(0,10)/10;
	
	this.sty.position="fixed";
	this.sty.left=this.x+"px";
	this.sty.top=this.y+"px";
	this.sty.width="20px";
	this.sty.height="10px";
	this.sty.backgroundColor=COLORS[rand(0,COLORS.length-1)];
    }

    update(){
	this.x+=this.vx;
	this.y+=this.vy;
	
	if(this.y>=screen_h){
	    this.x=rand(0,screen_w);
	    this.y=rand(-300,-15);
	}
	
	this.ang+=this.spd;
	this.ang%=360;
	this.sty.left=this.x+"px";
	this.sty.top=this.y+"px";
	this.sty.transform="rotate3D("+this.rX+","+this.rY+","+this.rZ+","+this.ang+"deg)";
    }
}

let confetti=[];
let flag1=false;
let flag2=false;

setInterval(mainLoop,1000/20);

function mainLoop(){
    if(flag1){
	if(!flag2){
	    for(let i=0;i<CONFETTI_MAX;i++) confetti.push(new Confetti());
	    flag2=true;
	}
	else{
	    for(let i=0;i<CONFETTI_MAX-confetti.length;i++){confetti.push(new Confetti());}
	}

	for(let i=0;i<confetti.length;i++){confetti[i].update();}
    }
    
    if(!flag1){
	if(confetti.length){
	    for(let i=confetti.length-1;i>=0;i--){
		if(confetti[i].y<-10) confetti.splice(i,1);
		else confetti[i].update();
	    }
	}

	else{
	    for(let i=document.body.childElementCount-1;i>=init_tag_count;i--){
		document.body.removeChild(document.body.children[i]);
	    }
	    confetti=[];
	    flag2=false;
	}
    }
}

document.onkeydown=function(e){
    if(e.keyCode==KEY_NUMBER){
	flag1=1-flag1;
    }
}
