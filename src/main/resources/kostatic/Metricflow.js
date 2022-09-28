/*written by Huoyo/Chang Zhang ,please respect copyright*/
/* you can use it freely  but can not plagiarize it to pretend that you are the owner*/
/*v1.1.4*/
;function MetricFlow(domId,options){let defaultOptions={'auto':false,'drag':(undefined!=options&&options.hasOwnProperty('drag'))?options['drag']:true,'flow':(undefined!=options&&options.hasOwnProperty('flow'))?options['flow']:"horizontal",'link-start-offsetx':(undefined!=options&&options.hasOwnProperty('link-start-offsetx'))?options['link-start-offsetx']:0,'link-start-offsety':(undefined!=options&&options.hasOwnProperty('link-start-offsety'))?options['link-start-offsety']:0,'link-end-offsetx':(undefined!=options&&options.hasOwnProperty('link-end-offsetx'))?options['link-end-offsetx']:0,'link-end-offsety':(undefined!=options&&options.hasOwnProperty('link-end-offsety'))?options['link-end-offsety']:0,'link-width-offset':(undefined!=options&&options.hasOwnProperty('link-width-offset'))?2+options['link-width-offset']:2,'link-color':(undefined!=options&&options.hasOwnProperty('link-color'))?options['link-color']:'#6c956c','node-distance-x':(undefined!=options&&options.hasOwnProperty('node-distance-offsetx'))?100+options['node-distance-offsetx']:100,'node-distance-y':(undefined!=options&&options.hasOwnProperty('node-distance-offsety'))?100+options['node-distance-offsety']:100};let defaultStyle={"node-type":'metric',"node-width":null,"node-height":null,'border-color':'#4a555e','border-width':'2px','title-color':'#4a555e','data-color':'white','title-font-size':'15px','title-font-color':'white','data-font-size':'13px','data-font-color':'black'};let styleDom=document.getElementsByTagName("style")[0];if(styleDom!=undefined){styleDom.innerHTML+='.ko-node{position:absolute;background-color:#4a555e;border:2px solid #4a555e;border-radius:5px;width:auto;list-style:none;}.ko-node .ko-node-title{padding-top: 2px;padding-bottom: 2px;font-size:16px;padding-left:12px;padding-right:12px;background-color:#4b804b;color:white;}.ko-node .ko-node-li{padding-top:3px;font-size:11px;padding-left:12px;padding-right:12px;background-color:white;color:black;border-top:none;border-bottom:1px solid gray;}'}else{let style=document.createElement('style');style.type='text/css';style.rel='stylesheet';style.appendChild(document.createTextNode(".ko-node{position:absolute;background-color:#4a555e;border:2px solid #4a555e;border-radius:5px;width:auto;list-style:none;}.ko-node .ko-node-title{padding-top: 2px;padding-bottom: 2px;font-size:16px;padding-left:12px;padding-right:12px;background-color:#4b804b;color:white;}.ko-node .ko-node-li{padding-top:3px;font-size:11px;padding-left:12px;padding-right:12px;background-color:white;color:black;border-top:none;border-bottom:1px solid gray;}"));let head=document.getElementsByTagName('head')[0];head.appendChild(style)};let o=new Object();o.dx=defaultOptions['node-distance-x'];o.dy=defaultOptions['node-distance-y'];o.allNodes=new Map();o.relationLocations=new Map();o.back=document.getElementById(domId);o.back.className=`${domId}ko-back`;let backWidth=Number(o.back.getAttribute("width").replace("px","").replace("%",""))*2;let backHeight=Number(o.back.getAttribute("height").replace("px","").replace("%",""))*1.5;o.back.innerHTML=`<svg class="${domId}-graph ko-back"id="${domId}-graph"width="${backWidth}px"height="${backHeight}px"xmlns="http://www.w3.org/2000/svg"><g id="relationSvgs"></g><defs><marker id='arrow'markerWidth='13'markerHeight='13'refx='6'refy='7'orient='auto'><path d='M2,10 L6,7 L2,4 L2,10'style="fill:${defaultOptions['link-color']}"/></marker></defs></svg>`;o.svgBack=document.getElementById(domId+'-graph');o.nodeRelations=document.getElementById('relationSvgs');let levelInit;function getXy(nodeData,i,w,h){let rootX=nodeData['x'];let rootY=nodeData['y'];let level=nodeData['level'];let children=nodeData['children'];let dy=o.dy/Math.pow(2,level);let childrenLength=children.length;let childX;let childY;if(defaultOptions['flow']=='vertical'){if(childrenLength==1){childX=rootX;childY=rootY+h+o.dx}else if(childrenLength>1){if(i==0){childX=rootX-(childrenLength-1)*(w+dy)/2;childY=rootY+h+o.dx;levelInit.set(level,[childX,childY])}else{childX=levelInit.get(level)[0]+i*(w+dy);childY=levelInit.get(level)[1]}}}else{if(childrenLength==1){childX=rootX+w+o.dx;childY=rootY}else if(childrenLength>1){if(i==0){childX=rootX+w+o.dx;childY=rootY-(childrenLength-1)*(h+dy)/2;levelInit.set(level,[childX,childY])}else{childX=levelInit.get(level)[0];childY=levelInit.get(level)[1]+i*(h+dy)}}};return[childX,childY]};function getXyByChildDom(rootDom,nodeData,i,w,h,childData,formDataFunc){let rootX=nodeData['x'];let rootY=nodeData['y'];let level=nodeData['level'];let children=nodeData['children'];let dy=o.dy/Math.pow(2,level);let childrenLength=children.length;let childX;let childY;let childDom;if(o.exists(childData['id'])){childDom=document.getElementById(childData['id'])}else{if(formDataFunc!=null&&formDataFunc!=undefined){childDom=o.createNode(formDataFunc(childData),rootX,rootY)}else{childDom=o.createNode(childData,rootX,rootY)}};let childW=Number(childDom.getAttribute("width"));let childH=Number(childDom.getAttribute("height"));if(defaultOptions['flow']=='vertical'){if(childrenLength==1){childX=rootX+w/2-childW/2;childY=rootY+h+o.dy}else if(childrenLength>1){if(i==0){childX=rootX-(childrenLength-1)*(w+dy)/2;childY=rootY+h+o.dy;levelInit.set(level,[childX,childY])}else{childX=levelInit.get(level)[0]+i*(w+dy);childY=levelInit.get(level)[1]}}}else{if(childrenLength==1){childX=rootX+w+o.dx;childY=rootY+h/2-childH/2}else if(childrenLength>1){if(i==0){childX=rootX+w+o.dx;childY=rootY-(childrenLength-1)*(h+dy)/2;levelInit.set(level,[childX,childY])}else{childX=levelInit.get(level)[0];childY=levelInit.get(level)[1]+i*(h+dy)}}};childDom.setAttribute("x",childX);childDom.setAttribute("y",childY);let sourceOuts=o.allNodes.get(rootDom.id).get("outs");if(sourceOuts.indexOf("line-"+rootDom.id+'-'+childDom.id)==-1){o.createLink(rootDom,childDom)};reDrawNodeLines(childDom);return[childX,childY]};function recurseNode(nodes,formDataFunc){let rootDom;if(o.allNodes[nodes['id']]!=undefined&&o.allNodes[nodes['id']]!=null){rootDom=document.getElementById(nodes['id'])}else{if(formDataFunc!=null&&formDataFunc!=undefined){rootDom=o.createNode(formDataFunc(nodes))}else{rootDom=o.createNode(nodes)}};if(nodes.hasOwnProperty("children")){let children=nodes['children'];if(children==null||children==undefined){return};let rootDomW=Number(rootDom.getAttribute("width"));let rootDomH=Number(rootDom.getAttribute("height"));for(let index in children){let childData=children[index];childData['from']=nodes['id'];if(childData.hasOwnProperty("x")==false){let newXy=getXyByChildDom(rootDom,nodes,index,rootDomW,rootDomH,childData,formDataFunc);childData['x']=newXy[0];childData['y']=newXy[1]};childData['level']=nodes['level']+1;recurseNode(childData,formDataFunc)}}};o.createNodes=function(nodesData,formDataFunc){if(nodesData instanceof Array){for(let index in nodesData){let createData=nodesData[index];if(formDataFunc!=null&&formDataFunc!=undefined){if(createData.hasOwnProperty("children")){o.createNodes(createData,formDataFunc)}else{o.createNode(formDataFunc(createData))}}else{if(createData.hasOwnProperty("children")){o.createNodes(createData)}else{o.createNode(createData)}}}}else if(nodesData.hasOwnProperty("children")){if(nodesData.hasOwnProperty("x")==false||nodesData.hasOwnProperty("y")==false){throw Error("invalid data which does not have x and y!");return};levelInit=new Map();nodesData['level']=1;recurseNode(nodesData,formDataFunc);levelInit=null}else{if(formDataFunc!=null&&formDataFunc!=undefined){o.createNode(formDataFunc(nodesData))}else{o.createNode(nodesData)}}};function formatTheme(data,style){for(let key in defaultStyle){if(!style.hasOwnProperty(key)){style[key]=defaultStyle[key]}};data['node-type']=style['node-type'];if(data['node-type']=='metric'){let w=style['node-width']!=null?'width:'+style['node-width']:'';let h=style['node-height']!=null?'height:'+style['node-height']:'';data["style"]=`border:${style['border-width']} solid ${style['border-color']};background-color:${style['data-color']};${w};${h}`}else if(data['node-type']=='circle'){let w=style['node-width']!=null?'width:'+style['node-width']:'width:50px';let h=style['node-height']!=null?'height:'+style['node-height']:'height:50px';let lh=style['node-height']!=null?'line-height:'+style['node-height']:'line-height:50px';data["style"]=`border:${style['border-width']} solid ${style['border-color']};background-color:${style['data-color']};${w};${h};${lh}`}else if(data['node-type']=='rectangle'){let w=style['node-width']!=null?'width:'+style['node-width']:'width:60px';let h=style['node-height']!=null?'height:'+style['node-height']:'height:40px';let lh=style['node-height']!=null?'line-height:'+style['node-height']:'line-height:40px';data["style"]=`border:${style['border-width']} solid ${style['border-color']};background-color:${style['data-color']};${w};${h};${lh}`}else{throw Error('Invalid nodeType,supported types:{metric,circle,rectangle}');}data["title"]["style"]=`font-size:${style['title-font-size']};background-color:${style['title-color']};color:${style['title-font-color']};`;if(data.hasOwnProperty("data")){for(let i=0;i<data["data"].length;i++){if(i==data["data"].length-1){data["data"][i]['style']=`font-size:${style['data-font-size']};background-color:${style['data-color']};color:${style['data-font-color']};border-bottom:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px;padding-bottom:5px;`;}else{data["data"][i]['style']=`font-size:${style['data-font-size']};background-color:${style['data-color']};color:${style['data-font-color']};`;};};};return data;}o.exists=function(id){if(o.allNodes.get(id)!=undefined&&o.allNodes.get(id)!=null){return true;};return false;};o.createNode=function(param,x,y){x=(x==undefined||x==null)?param['x']:x;y=(y==undefined||y==null)?param['y']:y;if(o.allNodes.get(param['id'])!=undefined&&o.allNodes.get(param['id'])!=null){let node=document.getElementById(param['id']);return node};param=formatTheme(param,param.hasOwnProperty("style")?param['style']:defaultStyle);let dataHtml='';if(param.hasOwnProperty("data")){for(let index in param.data){dataHtml+=`<div class="${param['id']} ko-node-li"style="${param.data[index]['style']}">${param.data[index]['name']}</div>`;}};let functionText=getFunctionsText(param);let titleStyle=param['title']['style'];let nodeStyle=param['style'];let nodeText;let nodeType=param['node-type'];if(nodeType=='metric'){nodeText=`<foreignObject ${functionText}id="${param['id']}"x="${x}"y="${y}"width="800"height="800"style="cursor: default"requiredExtensions="http://www.w3.org/1999/xhtml"><body xmlns="http://www.w3.org/1999/xhtml"><div id="${param['id']}-node"class="ko-node"style="${nodeStyle}"><div class="${param['id']} ko-node-title"style="${titleStyle}">${param['title']['name']}</div>${dataHtml}</div></body></foreignObject>`;}else if(nodeType=='circle'){nodeText=`<foreignObject ${functionText}id="${param['id']}"x="${x}"y="${y}"width="400"height="400"style="cursor: default"requiredExtensions="http://www.w3.org/1999/xhtml"><body xmlns="http://www.w3.org/1999/xhtml"><div id="${param['id']}-node"class="${param['id']} ko-node"style="${nodeStyle};${titleStyle};border-radius: 100px; overflow:hidden;font-size: 9px;text-align: center">${param['title']['name']}</div></body></foreignObject>`;}else if(nodeType=='rectangle'){nodeText=`<foreignObject ${functionText}id="${param['id']}"x="${x}"y="${y}"width="400"height="400"style="cursor: default"requiredExtensions="http://www.w3.org/1999/xhtml"><body xmlns="http://www.w3.org/1999/xhtml"><div id="${param['id']}-node"class="${param['id']} ko-node"style="${nodeStyle};${titleStyle};border-radius: 5px; overflow:hidden;font-size: 9px;text-align: center">${param['title']['name']}</div></body></foreignObject>`;}else{throw Error('Invalid nodeType,supported types:{metric,circle,rectangle}');};o.svgBack.innerHTML+=nodeText;let node=document.getElementById(param['id']);let nodeDiv=document.getElementById(param['id']+"-node");node.setAttribute('x',(param['x']||x));node.setAttribute('y',(param['y']||y));node.setAttribute('width',nodeDiv.offsetWidth+5);node.setAttribute('height',nodeDiv.offsetHeight+5);let nodeObject=new Map();nodeObject.set("ins",new Array());nodeObject.set("outs",new Array());nodeObject.set("node",node);o.allNodes.set(node.id,nodeObject);if(param.hasOwnProperty("from")){let fromId=param['from'];if(typeof(fromId)=='string'){let from=document.getElementById(fromId);if(from!=undefined){o.createLink(from,node);}}else if(fromId instanceof Array){for(let i in fromId){let from=document.getElementById(fromId[i]);if(from!=undefined){o.createLink(from,node);}}}};return node};function getFunctionsText(param){let text='';if(param.hasOwnProperty("click")){text+=' onclick="'+param['click']+'(event);"';};if(param.hasOwnProperty("dblclick")){text+=' ondblclick="'+param['dblclick']+'(event);"';};if(param.hasOwnProperty("mousedown")){text+=' onmousedown="'+param['mousedown']+'(event);"';};if(param.hasOwnProperty("mouseenter")){text+=' onmouseenter="'+param['mouseenter']+'(event);"';};if(param.hasOwnProperty("mouseleave")){text+=' onmouseleave="'+param['mouseleave']+'(event);"';};if(param.hasOwnProperty("mousemove")){text+=' onmousemove="'+param['mousemove']+'(event);"';};if(param.hasOwnProperty("mouseover")){text+=' onmouseover="'+param['mouseover']+'(event);"';};if(param.hasOwnProperty("mouseout")){text+=' onmouseout="'+param['mouseout']+'(event);"';};if(param.hasOwnProperty("mouseup")){text+=' onmouseup="'+param['mouseup']+'(event);"';};if(param.hasOwnProperty("contextmenu")){text+=' oncontextmenu="'+param['contextmenu']+'(event);"';};return text};o.createSimLink=function(source,target){let startNode=document.getElementById(source.id+"-node");let endNode=document.getElementById(target.id+"-node");let startNodeWidth=Number(startNode.offsetWidth);let startNodeHeight=Number(startNode.offsetHeight);let endNodeWidth=Number(endNode.offsetWidth);let endNodeHeight=Number(endNode.offsetHeight);let startX=Number(source.getAttribute("x"));let startY=Number(source.getAttribute("y"));let endX=Number(target.getAttribute("x"));let endY=Number(target.getAttribute("y"));let startPointX=null;let startPointY=null;let endPointX=null;let endPointY=null;let linePlusX=0;let pointPlusX=0;let linePlusY=0;let pointPlusY=0;if((endX+endNodeWidth)>(startX-40)&&endX<(startX+startNodeWidth+40)&&endY>startY){[startPointX,startPointY,endPointX,endPointY,linePlusX,pointPlusX,linePlusY,pointPlusY]=arrowDown(startX,startY,startNodeWidth,startNodeHeight,endX,endY,endNodeWidth,endNodeHeight);o.relationLocations[source.id+target.id]="down";}else if((endX+endNodeWidth)>(startX-40)&&endX<(startX+startNodeWidth+40)&&endY<startY){[startPointX,startPointY,endPointX,endPointY,linePlusX,pointPlusX,linePlusY,pointPlusY]=arrowUp(startX,startY,startNodeWidth,startNodeHeight,endX,endY,endNodeWidth,endNodeHeight);o.relationLocations[source.id+target.id]="up";}else if(endX>(startX+startNodeWidth)&&(startY-endNodeHeight)<(endY)&&(startY+endNodeHeight)>endY){[startPointX,startPointY,endPointX,endPointY,linePlusX,pointPlusX,linePlusY,pointPlusY]=arrowRight(startX,startY,startNodeWidth,startNodeHeight,endX,endY,endNodeWidth,endNodeHeight);o.relationLocations[source.id+target.id]="right";}else if((endX+endNodeWidth)<(startX-40)&&(startY-endNodeHeight)<(endY)&&(startY+endNodeHeight)>endY){[startPointX,startPointY,endPointX,endPointY,linePlusX,pointPlusX,linePlusY,pointPlusY]=arrowLeft(startX,startY,startNodeWidth,startNodeHeight,endX,endY,endNodeWidth,endNodeHeight);o.relationLocations[source.id+target.id]="left";}else{if(o.relationLocations[source.id+target.id]=='up'){[startPointX,startPointY,endPointX,endPointY,linePlusX,pointPlusX,linePlusY,pointPlusY]=arrowUp(startX,startY,startNodeWidth,startNodeHeight,endX,endY,endNodeWidth,endNodeHeight);}else if(o.relationLocations[source.id+target.id]=='down'){[startPointX,startPointY,endPointX,endPointY,linePlusX,pointPlusX,linePlusY,pointPlusY]=arrowDown(startX,startY,startNodeWidth,startNodeHeight,endX,endY,endNodeWidth,endNodeHeight);}else if(o.relationLocations[source.id+target.id]=='left'){[startPointX,startPointY,endPointX,endPointY,linePlusX,pointPlusX,linePlusY,pointPlusY]=arrowLeft(startX,startY,startNodeWidth,startNodeHeight,endX,endY,endNodeWidth,endNodeHeight);}else{[startPointX,startPointY,endPointX,endPointY,linePlusX,pointPlusX,linePlusY,pointPlusY]=arrowRight(startX,startY,startNodeWidth,startNodeHeight,endX,endY,endNodeWidth,endNodeHeight);}};let svgNS="http://www.w3.org/2000/svg";let path=document.createElementNS(svgNS,'path');path.setAttribute("d",`M ${startPointX+linePlusX} ${startPointY+linePlusY} L ${endPointX-linePlusX} ${endPointY-linePlusY}`);path.setAttribute("stroke",defaultOptions['link-color']);path.setAttribute("stroke-width",defaultOptions['link-width-offset']);path.setAttribute("fill","none");path.setAttribute("marker-end","url(#arrow)");path.setAttribute("id",'line-'+source.id+'-'+target.id);document.getElementById('relationSvgs').appendChild(path);let point=document.createElementNS(svgNS,'circle');point.setAttribute("cx",startPointX+pointPlusX);point.setAttribute("cy",startPointY+pointPlusY);point.setAttribute("r",defaultOptions['link-width-offset']+1);point.setAttribute("stroke",defaultOptions['link-color']);point.setAttribute("stroke-width",defaultOptions['link-width-offset']);point.setAttribute("fill","none");point.setAttribute("id","pointstart-"+source.id+"-"+target.id);document.getElementById('relationSvgs').appendChild(point);let pointEnd=document.createElementNS(svgNS,'circle');pointEnd.setAttribute("cx",endPointX-pointPlusX);pointEnd.setAttribute("cy",endPointY-pointPlusY);pointEnd.setAttribute("r",defaultOptions['link-width-offset']+1);pointEnd.setAttribute("stroke",defaultOptions['link-color']);pointEnd.setAttribute("stroke-width",defaultOptions['link-width-offset']);pointEnd.setAttribute("fill","none");pointEnd.setAttribute("id","pointend-"+source.id+"-"+target.id);document.getElementById('relationSvgs').appendChild(pointEnd);return true;};function arrowUp(startX,startY,startNodeWidth,startNodeHeight,endX,endY,endNodeWidth,endNodeHeight){let startPointX=startX+startNodeWidth/2;let startPointY=startY;let endPointX=endX+endNodeWidth/2;let endPointY=endY+endNodeHeight;let linePlusX=0;let pointPlusX=0;let linePlusY=-8;let pointPlusY=-4;return[startPointX,startPointY,endPointX,endPointY,linePlusX,pointPlusX,linePlusY,pointPlusY]};function arrowRight(startX,startY,startNodeWidth,startNodeHeight,endX,endY,endNodeWidth,endNodeHeight){let startPointX=startX+startNodeWidth;let startPointY=startY+startNodeHeight/2;let endPointX=endX;let endPointY=endY+endNodeHeight/2;let linePlusX=8;let pointPlusX=4;let linePlusY=0;let pointPlusY=0;return[startPointX,startPointY,endPointX,endPointY,linePlusX,pointPlusX,linePlusY,pointPlusY]};function arrowDown(startX,startY,startNodeWidth,startNodeHeight,endX,endY,endNodeWidth,endNodeHeight){let startPointX=startX+startNodeWidth/2;let startPointY=startY+startNodeHeight;let endPointX=endX+endNodeWidth/2;let endPointY=endY;let linePlusX=0;let pointPlusX=0;let linePlusY=8;let pointPlusY=4;return[startPointX,startPointY,endPointX,endPointY,linePlusX,pointPlusX,linePlusY,pointPlusY]};function arrowLeft(startX,startY,startNodeWidth,startNodeHeight,endX,endY,endNodeWidth,endNodeHeight){let startPointX=startX;let startPointY=startY+startNodeHeight/2;let endPointX=endX+endNodeWidth;let endPointY=endY+endNodeHeight/2;let linePlusX=-8;let pointPlusX=-4;let linePlusY=0;let pointPlusY=0;return[startPointX,startPointY,endPointX,endPointY,linePlusX,pointPlusX,linePlusY,pointPlusY]};o.createLink=function(source,target){let sourceOuts=o.allNodes.get(source.id).get("outs");let targetIns=o.allNodes.get(target.id).get("ins");if((sourceOuts.indexOf("line-"+source.id+'-'+target.id)>-1)&&(targetIns.indexOf("line-"+source.id+'-'+target.id)>-1)){return};o.createSimLink(source,target);sourceOuts.push('line-'+source.id+'-'+target.id);targetIns.push('line-'+source.id+'-'+target.id);};o.removeNode=function(nodeId){let objectData=o.allNodes.get(nodeId);if(objectData==undefined){return};let inIds=objectData.get("ins");for(let index in inIds){let lineId=inIds[index];let lineIdSplit=lineId.split('-');let sourceId=lineIdSplit[1];let targetId=lineIdSplit[2];if(document.getElementById(lineId)!=undefined){document.getElementById(lineId).remove();document.getElementById('pointstart-'+sourceId+"-"+targetId).remove();document.getElementById('pointend-'+sourceId+"-"+targetId).remove();}};let outIds=o.allNodes.get(nodeId).get("outs");for(let index in outIds){let lineId=outIds[index];let lineIdSplit=lineId.split('-');let sourceId=lineIdSplit[1];let targetId=lineIdSplit[2];if(document.getElementById(lineId)!=undefined){document.getElementById(lineId).remove();document.getElementById('pointstart-'+sourceId+"-"+targetId).remove();document.getElementById('pointend-'+sourceId+"-"+targetId).remove();}}document.getElementById(nodeId).remove();o.allNodes.delete(nodeId);};function reDrawNodeLines(node){let objectData=o.allNodes.get(node.id);if(objectData==undefined){return};defaultOptions['auto']=true;let inIds=objectData.get("ins");for(let index in inIds){let lineId=inIds[index];let lineIdSplit=lineId.split('-');let sourceId=lineIdSplit[1];let targetId=lineIdSplit[2];if(document.getElementById(lineId)!=undefined){document.getElementById(lineId).remove();document.getElementById('pointstart-'+sourceId+'-'+targetId).remove();document.getElementById('pointend-'+sourceId+'-'+targetId).remove();o.createSimLink(document.getElementById(sourceId),node)}};let outIds=o.allNodes.get(node.id).get("outs");for(let index in outIds){let lineId=outIds[index];let lineIdSplit=lineId.split('-');let sourceId=lineIdSplit[1];let targetId=lineIdSplit[2];if(document.getElementById(lineId)!=undefined){document.getElementById(lineId).remove();document.getElementById('pointstart-'+sourceId+'-'+targetId).remove();document.getElementById('pointend-'+sourceId+'-'+targetId).remove();o.createSimLink(node,document.getElementById(targetId));}}};o.reDrawLines=function(){o.allNodes.forEach(function(nodeData,nodeId){reDrawNodeLines(document.getElementById(nodeId));})};o.moveNode;o.moveNodeX;o.moveNodeY;function backMouseDown(e){if(defaultOptions['drag']==false){return;};let mouseTarget=e.target;o.moveNodeX=e.clientX;o.moveNodeY=e.clientY;let clssName=mouseTarget.getAttribute('class');if(clssName!=null&&clssName.indexOf("ko-node")>-1){let targetId=e.target.getAttribute('class').split(" ")[0];o.moveNode=document.getElementById(targetId);o.moveNode.style.cursor='move';o.moveNode.onmousemove=nodeMove;}else{o.moveNode=mouseTarget;o.moveNode.setAttribute("style","cursor:move");o.moveNode.onmousemove=backMove;}};o.svgBack.onmousedown=backMouseDown;o.back.onmousedown=backMouseDown;function nodeMove(e){if(o.moveNode==null){return}e=e||window.event;let offsetX=o.moveNodeX-e.clientX;let offsetY=o.moveNodeY-e.clientY;o.moveNodeX=e.clientX;o.moveNodeY=e.clientY;o.moveNode.setAttribute('x',Number(o.moveNode.getAttribute("x"))-offsetX);o.moveNode.setAttribute('y',Number(o.moveNode.getAttribute("y"))-offsetY);reDrawNodeLines(o.moveNode);};function backMove(e){if(o.moveNode==null){return};e=e||window.event;let offsetX=o.moveNodeX-e.clientX;let offsetY=o.moveNodeY-e.clientY;o.moveNodeX=e.clientX;o.moveNodeY=e.clientY;o.allNodes.forEach(function(nodeData,nodeId){let moveNode=document.getElementById(nodeId);moveNode.setAttribute('x',Number(moveNode.getAttribute("x"))-offsetX);moveNode.setAttribute('y',Number(moveNode.getAttribute("y"))-offsetY);reDrawNodeLines(moveNode);})};o.svgBack.onmouseup=function(e){if(o.moveNode!=null){o.moveNode.style.cursor='default';o.moveNode=null}};return o};