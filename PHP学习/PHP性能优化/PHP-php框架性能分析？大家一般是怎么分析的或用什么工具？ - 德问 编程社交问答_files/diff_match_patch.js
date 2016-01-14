(function(){function diff_match_patch(){this.Diff_Timeout=1;this.Diff_EditCost=4;this.Match_Threshold=0.5;this.Match_Distance=1E3;this.Patch_DeleteThreshold=0.5;this.Patch_Margin=4;this.Match_MaxBits=32}var DIFF_DELETE=-1,DIFF_INSERT=1,DIFF_EQUAL=0;
diff_match_patch.prototype.diff_main=function(a,b,c,d){typeof d=="undefined"&&(d=this.Diff_Timeout<=0?Number.MAX_VALUE:(new Date).getTime()+this.Diff_Timeout*1E3);if(a==null||b==null)throw Error("Null input. (diff_main)");if(a==b)return a?[[DIFF_EQUAL,a]]:[];typeof c=="undefined"&&(c=!0);var e=c,f=this.diff_commonPrefix(a,b),c=a.substring(0,f),a=a.substring(f),b=b.substring(f),f=this.diff_commonSuffix(a,b),g=a.substring(a.length-f),a=a.substring(0,a.length-f),b=b.substring(0,b.length-f),a=this.diff_compute_(a,
b,e,d);c&&a.unshift([DIFF_EQUAL,c]);g&&a.push([DIFF_EQUAL,g]);this.diff_cleanupMerge(a);return a};
diff_match_patch.prototype.diff_compute_=function(a,b,c,d){if(!a)return[[DIFF_INSERT,b]];if(!b)return[[DIFF_DELETE,a]];var e=a.length>b.length?a:b,f=a.length>b.length?b:a,g=e.indexOf(f);if(g!=-1)return c=[[DIFF_INSERT,e.substring(0,g)],[DIFF_EQUAL,f],[DIFF_INSERT,e.substring(g+f.length)]],a.length>b.length&&(c[0][0]=c[2][0]=DIFF_DELETE),c;if(f.length==1)return[[DIFF_DELETE,a],[DIFF_INSERT,b]];return(e=this.diff_halfMatch_(a,b))?(b=e[1],f=e[3],a=e[4],e=this.diff_main(e[0],e[2],c,d),c=this.diff_main(b,
f,c,d),e.concat([[DIFF_EQUAL,a]],c)):c&&a.length>100&&b.length>100?this.diff_lineMode_(a,b,d):this.diff_bisect_(a,b,d)};
diff_match_patch.prototype.diff_lineMode_=function(a,b,c){var d=this.diff_linesToChars_(a,b),a=d[0],b=d[1],d=d[2],a=this.diff_bisect_(a,b,c);this.diff_charsToLines_(a,d);this.diff_cleanupSemantic(a);a.push([DIFF_EQUAL,""]);for(var e=b=0,f=0,g=d="";b<a.length;){switch(a[b][0]){case DIFF_INSERT:f++;g+=a[b][1];break;case DIFF_DELETE:e++;d+=a[b][1];break;case DIFF_EQUAL:if(e>=1&&f>=1){d=this.diff_main(d,g,!1,c);a.splice(b-e-f,e+f);b=b-e-f;for(e=d.length-1;e>=0;e--)a.splice(b,0,d[e]);b+=d.length}e=f=0;
g=d=""}b++}a.pop();return a};
diff_match_patch.prototype.diff_bisect_=function(a,b,c){for(var d=a.length,e=b.length,f=Math.ceil((d+e)/2),g=2*f,h=Array(g),j=Array(g),i=0;i<g;i++)h[i]=-1,j[i]=-1;h[f+1]=0;j[f+1]=0;for(var i=d-e,k=i%2!=0,l=0,o=0,r=0,n=0,p=0;p<f;p++){if((new Date).getTime()>c)break;for(var t=-p+l;t<=p-o;t+=2){var m=f+t,q;q=t==-p||t!=p&&h[m-1]<h[m+1]?h[m+1]:h[m-1]+1;for(var u=q-t;q<d&&u<e&&a.charAt(q)==b.charAt(u);)q++,u++;h[m]=q;if(q>d)o+=2;else if(u>e)l+=2;else if(k&&(m=f+i-t,m>=0&&m<g&&j[m]!=-1)){var s=d-j[m];if(q>=
s)return this.diff_bisectSplit_(a,b,q,u,c)}}for(t=-p+r;t<=p-n;t+=2){m=f+t;s=t==-p||t!=p&&j[m-1]<j[m+1]?j[m+1]:j[m-1]+1;for(q=s-t;s<d&&q<e&&a.charAt(d-s-1)==b.charAt(e-q-1);)s++,q++;j[m]=s;if(s>d)n+=2;else if(q>e)r+=2;else if(!k&&(m=f+i-t,m>=0&&m<g&&h[m]!=-1&&(q=h[m],u=f+q-m,s=d-s,q>=s)))return this.diff_bisectSplit_(a,b,q,u,c)}}return[[DIFF_DELETE,a],[DIFF_INSERT,b]]};
diff_match_patch.prototype.diff_bisectSplit_=function(a,b,c,d,e){var f=a.substring(0,c),g=b.substring(0,d),a=a.substring(c),b=b.substring(d),f=this.diff_main(f,g,!1,e),e=this.diff_main(a,b,!1,e);return f.concat(e)};
diff_match_patch.prototype.diff_linesToChars_=function(a,b){function c(a){for(var b="",c=0,f=-1,g=d.length;f<a.length-1;){f=a.indexOf("\n",c);f==-1&&(f=a.length-1);var o=a.substring(c,f+1),c=f+1;(e.hasOwnProperty?e.hasOwnProperty(o):e[o]!==void 0)?b+=String.fromCharCode(e[o]):(b+=String.fromCharCode(g),e[o]=g,d[g++]=o)}return b}var d=[],e={};d[0]="";var f=c(a),g=c(b);return[f,g,d]};
diff_match_patch.prototype.diff_charsToLines_=function(a,b){for(var c=0;c<a.length;c++){for(var d=a[c][1],e=[],f=0;f<d.length;f++)e[f]=b[d.charCodeAt(f)];a[c][1]=e.join("")}};diff_match_patch.prototype.diff_commonPrefix=function(a,b){if(!a||!b||a.charAt(0)!=b.charAt(0))return 0;for(var c=0,d=Math.min(a.length,b.length),e=d,f=0;c<e;)a.substring(f,e)==b.substring(f,e)?f=c=e:d=e,e=Math.floor((d-c)/2+c);return e};
diff_match_patch.prototype.diff_commonSuffix=function(a,b){if(!a||!b||a.charAt(a.length-1)!=b.charAt(b.length-1))return 0;for(var c=0,d=Math.min(a.length,b.length),e=d,f=0;c<e;)a.substring(a.length-e,a.length-f)==b.substring(b.length-e,b.length-f)?f=c=e:d=e,e=Math.floor((d-c)/2+c);return e};
diff_match_patch.prototype.diff_commonOverlap_=function(a,b){var c=a.length,d=b.length;if(c==0||d==0)return 0;c>d?a=a.substring(c-d):c<d&&(b=b.substring(0,c));c=Math.min(c,d);if(a==b)return c;for(var d=0,e=1;;){var f=a.substring(c-e),f=b.indexOf(f);if(f==-1)return d;e+=f;if(f==0||a.substring(c-e)==b.substring(0,e))d=e,e++}};
diff_match_patch.prototype.diff_halfMatch_=function(a,b){function c(a,b,c){for(var d=a.substring(c,c+Math.floor(a.length/4)),e=-1,g="",h,j,m,q;(e=b.indexOf(d,e+1))!=-1;){var u=f.diff_commonPrefix(a.substring(c),b.substring(e)),s=f.diff_commonSuffix(a.substring(0,c),b.substring(0,e));g.length<s+u&&(g=b.substring(e-s,e)+b.substring(e,e+u),h=a.substring(0,c-s),j=a.substring(c+u),m=b.substring(0,e-s),q=b.substring(e+u))}return g.length*2>=a.length?[h,j,m,q,g]:null}if(this.Diff_Timeout<=0)return null;
var d=a.length>b.length?a:b,e=a.length>b.length?b:a;if(d.length<4||e.length*2<d.length)return null;var f=this,g=c(d,e,Math.ceil(d.length/4)),d=c(d,e,Math.ceil(d.length/2));if(!g&&!d)return null;else g=d?g?g[4].length>d[4].length?g:d:d:g;var h,j;a.length>b.length?(d=g[0],e=g[1],h=g[2],j=g[3]):(h=g[0],j=g[1],d=g[2],e=g[3]);return[d,e,h,j,g[4]]};
diff_match_patch.prototype.diff_cleanupSemantic=function(a){for(var b=!1,c=[],d=0,e=null,f=0,g=0,h=0,j=0,i=0;f<a.length;)a[f][0]==DIFF_EQUAL?(c[d++]=f,g=j,h=i,i=j=0,e=a[f][1]):(a[f][0]==DIFF_INSERT?j+=a[f][1].length:i+=a[f][1].length,e!==null&&e.length<=Math.max(g,h)&&e.length<=Math.max(j,i)&&(a.splice(c[d-1],0,[DIFF_DELETE,e]),a[c[d-1]+1][0]=DIFF_INSERT,d--,d--,f=d>0?c[d-1]:-1,i=j=h=g=0,e=null,b=!0)),f++;b&&this.diff_cleanupMerge(a);this.diff_cleanupSemanticLossless(a);for(f=1;f<a.length;){if(a[f-
1][0]==DIFF_DELETE&&a[f][0]==DIFF_INSERT){b=a[f-1][1];c=a[f][1];d=this.diff_commonOverlap_(b,c);if(d>=b.length/2||d>=c.length/2)a.splice(f,0,[DIFF_EQUAL,c.substring(0,d)]),a[f-1][1]=b.substring(0,b.length-d),a[f+1][1]=c.substring(d),f++;f++}f++}};
diff_match_patch.prototype.diff_cleanupSemanticLossless=function(a){function b(a,b){if(!a||!b)return 5;var h=0;if(a.charAt(a.length-1).match(c)||b.charAt(0).match(c))if(h++,a.charAt(a.length-1).match(d)||b.charAt(0).match(d))if(h++,a.charAt(a.length-1).match(e)||b.charAt(0).match(e))h++,(a.match(f)||b.match(g))&&h++;return h}for(var c=/[^a-zA-Z0-9]/,d=/\s/,e=/[\r\n]/,f=/\n\r?\n$/,g=/^\r?\n\r?\n/,h=1;h<a.length-1;){if(a[h-1][0]==DIFF_EQUAL&&a[h+1][0]==DIFF_EQUAL){var j=a[h-1][1],i=a[h][1],k=a[h+1][1],
l=this.diff_commonSuffix(j,i);if(l)var o=i.substring(i.length-l),j=j.substring(0,j.length-l),i=o+i.substring(0,i.length-l),k=o+k;for(var l=j,o=i,r=k,n=b(j,i)+b(i,k);i.charAt(0)===k.charAt(0);){j+=i.charAt(0);var i=i.substring(1)+k.charAt(0),k=k.substring(1),p=b(j,i)+b(i,k);p>=n&&(n=p,l=j,o=i,r=k)}a[h-1][1]!=l&&(l?a[h-1][1]=l:(a.splice(h-1,1),h--),a[h][1]=o,r?a[h+1][1]=r:(a.splice(h+1,1),h--))}h++}};
diff_match_patch.prototype.diff_cleanupEfficiency=function(a){for(var b=!1,c=[],d=0,e="",f=0,g=!1,h=!1,j=!1,i=!1;f<a.length;){if(a[f][0]==DIFF_EQUAL)a[f][1].length<this.Diff_EditCost&&(j||i)?(c[d++]=f,g=j,h=i,e=a[f][1]):(d=0,e=""),j=i=!1;else if(a[f][0]==DIFF_DELETE?i=!0:j=!0,e&&(g&&h&&j&&i||e.length<this.Diff_EditCost/2&&g+h+j+i==3))a.splice(c[d-1],0,[DIFF_DELETE,e]),a[c[d-1]+1][0]=DIFF_INSERT,d--,e="",g&&h?(j=i=!0,d=0):(d--,f=d>0?c[d-1]:-1,j=i=!1),b=!0;f++}b&&this.diff_cleanupMerge(a)};
diff_match_patch.prototype.diff_cleanupMerge=function(a){a.push([DIFF_EQUAL,""]);for(var b=0,c=0,d=0,e="",f="",g;b<a.length;)switch(a[b][0]){case DIFF_INSERT:d++;f+=a[b][1];b++;break;case DIFF_DELETE:c++;e+=a[b][1];b++;break;case DIFF_EQUAL:c+d>1?(c!==0&&d!==0&&(g=this.diff_commonPrefix(f,e),g!==0&&(b-c-d>0&&a[b-c-d-1][0]==DIFF_EQUAL?a[b-c-d-1][1]+=f.substring(0,g):(a.splice(0,0,[DIFF_EQUAL,f.substring(0,g)]),b++),f=f.substring(g),e=e.substring(g)),g=this.diff_commonSuffix(f,e),g!==0&&(a[b][1]=f.substring(f.length-
g)+a[b][1],f=f.substring(0,f.length-g),e=e.substring(0,e.length-g))),c===0?a.splice(b-c-d,c+d,[DIFF_INSERT,f]):d===0?a.splice(b-c-d,c+d,[DIFF_DELETE,e]):a.splice(b-c-d,c+d,[DIFF_DELETE,e],[DIFF_INSERT,f]),b=b-c-d+(c?1:0)+(d?1:0)+1):b!==0&&a[b-1][0]==DIFF_EQUAL?(a[b-1][1]+=a[b][1],a.splice(b,1)):b++,c=d=0,f=e=""}a[a.length-1][1]===""&&a.pop();c=!1;for(b=1;b<a.length-1;)a[b-1][0]==DIFF_EQUAL&&a[b+1][0]==DIFF_EQUAL&&(a[b][1].substring(a[b][1].length-a[b-1][1].length)==a[b-1][1]?(a[b][1]=a[b-1][1]+a[b][1].substring(0,
a[b][1].length-a[b-1][1].length),a[b+1][1]=a[b-1][1]+a[b+1][1],a.splice(b-1,1),c=!0):a[b][1].substring(0,a[b+1][1].length)==a[b+1][1]&&(a[b-1][1]+=a[b+1][1],a[b][1]=a[b][1].substring(a[b+1][1].length)+a[b+1][1],a.splice(b+1,1),c=!0)),b++;c&&this.diff_cleanupMerge(a)};
diff_match_patch.prototype.diff_xIndex=function(a,b){var c=0,d=0,e=0,f=0,g;for(g=0;g<a.length;g++){a[g][0]!==DIFF_INSERT&&(c+=a[g][1].length);a[g][0]!==DIFF_DELETE&&(d+=a[g][1].length);if(c>b)break;e=c;f=d}return a.length!=g&&a[g][0]===DIFF_DELETE?f:f+(b-e)};
diff_match_patch.prototype.diff_prettyHtml=function(a){for(var b=[],c=0,d=/&/g,e=/</g,f=/>/g,g=/\n/g,h=/^\s*/g,j=0;j<a.length;j++){var i=a[j][0],k=a[j][1],l=k.replace(e,"&lt;").replace(f,"&gt;").replace(g,"<br>"),o=l.replace(h,""),r=l.length-o.length,n="";if(r>0)for(var p=0;p<r;p++)n+=" ";switch(i){case DIFF_INSERT:b[j]=n+"<ins>"+o+"</ins>";break;case DIFF_DELETE:b[j]=n+"<del>"+o+"</del>";break;case DIFF_EQUAL:b[j]=l}i!==DIFF_DELETE&&(c+=k.length)}return b.join("")};
diff_match_patch.prototype.diff_text1=function(a){for(var b=[],c=0;c<a.length;c++)a[c][0]!==DIFF_INSERT&&(b[c]=a[c][1]);return b.join("")};diff_match_patch.prototype.diff_text2=function(a){for(var b=[],c=0;c<a.length;c++)a[c][0]!==DIFF_DELETE&&(b[c]=a[c][1]);return b.join("")};
diff_match_patch.prototype.diff_levenshtein=function(a){for(var b=0,c=0,d=0,e=0;e<a.length;e++){var f=a[e][1];switch(a[e][0]){case DIFF_INSERT:c+=f.length;break;case DIFF_DELETE:d+=f.length;break;case DIFF_EQUAL:b+=Math.max(c,d),d=c=0}}b+=Math.max(c,d);return b};
diff_match_patch.prototype.diff_toDelta=function(a){for(var b=[],c=0;c<a.length;c++)switch(a[c][0]){case DIFF_INSERT:b[c]="+"+encodeURI(a[c][1]);break;case DIFF_DELETE:b[c]="-"+a[c][1].length;break;case DIFF_EQUAL:b[c]="="+a[c][1].length}return b.join("\t").replace(/%20/g," ")};
diff_match_patch.prototype.diff_fromDelta=function(a,b){for(var c=[],d=0,e=0,f=b.split(/\t/g),g=0;g<f.length;g++){var h=f[g].substring(1);switch(f[g].charAt(0)){case "+":try{c[d++]=[DIFF_INSERT,decodeURI(h)]}catch(j){throw Error("Illegal escape in diff_fromDelta: "+h);}break;case "-":case "=":var i=parseInt(h,10);if(isNaN(i)||i<0)throw Error("Invalid number in diff_fromDelta: "+h);h=a.substring(e,e+=i);f[g].charAt(0)=="="?c[d++]=[DIFF_EQUAL,h]:c[d++]=[DIFF_DELETE,h];break;default:if(f[g])throw Error("Invalid diff operation in diff_fromDelta: "+
f[g]);}}if(e!=a.length)throw Error("Delta length ("+e+") does not equal source text length ("+a.length+").");return c};diff_match_patch.prototype.match_main=function(a,b,c){if(a==null||b==null||c==null)throw Error("Null input. (match_main)");c=Math.max(0,Math.min(c,a.length));return a==b?0:a.length?a.substring(c,c+b.length)==b?c:this.match_bitap_(a,b,c):-1};
diff_match_patch.prototype.match_bitap_=function(a,b,c){function d(a,d){var e=a/b.length,g=Math.abs(c-d);return!f.Match_Distance?g?1:e:e+g/f.Match_Distance}if(b.length>this.Match_MaxBits)throw Error("Pattern too long for this browser.");var e=this.match_alphabet_(b),f=this,g=this.Match_Threshold,h=a.indexOf(b,c);h!=-1&&(g=Math.min(d(0,h),g),h=a.lastIndexOf(b,c+b.length),h!=-1&&(g=Math.min(d(0,h),g)));for(var j=1<<b.length-1,h=-1,i,k,l=b.length+a.length,o,r=0;r<b.length;r++){i=0;for(k=l;i<k;)d(r,c+
k)<=g?i=k:l=k,k=Math.floor((l-i)/2+i);l=k;i=Math.max(1,c-k+1);var n=Math.min(c+k,a.length)+b.length;k=Array(n+2);for(k[n+1]=(1<<r)-1;n>=i;n--){var p=e[a.charAt(n-1)];k[n]=r===0?(k[n+1]<<1|1)&p:(k[n+1]<<1|1)&p|(o[n+1]|o[n])<<1|1|o[n+1];if(k[n]&j&&(p=d(r,n-1),p<=g))if(g=p,h=n-1,h>c)i=Math.max(1,2*c-h);else break}if(d(r+1,c)>g)break;o=k}return h};
diff_match_patch.prototype.match_alphabet_=function(a){for(var b={},c=0;c<a.length;c++)b[a.charAt(c)]=0;for(c=0;c<a.length;c++)b[a.charAt(c)]|=1<<a.length-c-1;return b};
diff_match_patch.prototype.patch_addContext_=function(a,b){if(b.length!=0){for(var c=b.substring(a.start2,a.start2+a.length1),d=0;b.indexOf(c)!=b.lastIndexOf(c)&&c.length<this.Match_MaxBits-this.Patch_Margin-this.Patch_Margin;)d+=this.Patch_Margin,c=b.substring(a.start2-d,a.start2+a.length1+d);d+=this.Patch_Margin;(c=b.substring(a.start2-d,a.start2))&&a.diffs.unshift([DIFF_EQUAL,c]);(d=b.substring(a.start2+a.length1,a.start2+a.length1+d))&&a.diffs.push([DIFF_EQUAL,d]);a.start1-=c.length;a.start2-=
c.length;a.length1+=c.length+d.length;a.length2+=c.length+d.length}};
diff_match_patch.prototype.patch_make=function(a,b,c){var d;if(typeof a=="string"&&typeof b=="string"&&typeof c=="undefined")d=a,b=this.diff_main(d,b,!0),b.length>2&&(this.diff_cleanupSemantic(b),this.diff_cleanupEfficiency(b));else if(a&&typeof a=="object"&&typeof b=="undefined"&&typeof c=="undefined")b=a,d=this.diff_text1(b);else if(typeof a=="string"&&b&&typeof b=="object"&&typeof c=="undefined")d=a;else if(typeof a=="string"&&typeof b=="string"&&c&&typeof c=="object")d=a,b=c;else throw Error("Unknown call format to patch_make.");
if(b.length===0)return[];for(var c=[],a=new patch_obj,e=0,f=0,g=0,h=d,j=0;j<b.length;j++){var i=b[j][0],k=b[j][1];if(!e&&i!==DIFF_EQUAL)a.start1=f,a.start2=g;switch(i){case DIFF_INSERT:a.diffs[e++]=b[j];a.length2+=k.length;d=d.substring(0,g)+k+d.substring(g);break;case DIFF_DELETE:a.length1+=k.length;a.diffs[e++]=b[j];d=d.substring(0,g)+d.substring(g+k.length);break;case DIFF_EQUAL:k.length<=2*this.Patch_Margin&&e&&b.length!=j+1?(a.diffs[e++]=b[j],a.length1+=k.length,a.length2+=k.length):k.length>=
2*this.Patch_Margin&&e&&(this.patch_addContext_(a,h),c.push(a),a=new patch_obj,e=0,h=d,f=g)}i!==DIFF_INSERT&&(f+=k.length);i!==DIFF_DELETE&&(g+=k.length)}e&&(this.patch_addContext_(a,h),c.push(a));return c};diff_match_patch.prototype.patch_deepCopy=function(a){for(var b=[],c=0;c<a.length;c++){var d=a[c],e=new patch_obj;e.diffs=[];for(var f=0;f<d.diffs.length;f++)e.diffs[f]=d.diffs[f].slice();e.start1=d.start1;e.start2=d.start2;e.length1=d.length1;e.length2=d.length2;b[c]=e}return b};
diff_match_patch.prototype.patch_apply=function(a,b){if(a.length==0)return[b,[]];var a=this.patch_deepCopy(a),c=this.patch_addPadding(a),b=c+b+c;this.patch_splitMax(a);for(var d=0,e=[],f=0;f<a.length;f++){var g=a[f].start2+d,h=this.diff_text1(a[f].diffs),j,i=-1;if(h.length>this.Match_MaxBits){if(j=this.match_main(b,h.substring(0,this.Match_MaxBits),g),j!=-1&&(i=this.match_main(b,h.substring(h.length-this.Match_MaxBits),g+h.length-this.Match_MaxBits),i==-1||j>=i))j=-1}else j=this.match_main(b,h,g);
if(j==-1)e[f]=!1,d-=a[f].length2-a[f].length1;else if(e[f]=!0,d=j-g,g=i==-1?b.substring(j,j+h.length):b.substring(j,i+this.Match_MaxBits),h==g)b=b.substring(0,j)+this.diff_text2(a[f].diffs)+b.substring(j+h.length);else if(g=this.diff_main(h,g,!1),h.length>this.Match_MaxBits&&this.diff_levenshtein(g)/h.length>this.Patch_DeleteThreshold)e[f]=!1;else{this.diff_cleanupSemanticLossless(g);for(var h=0,k,i=0;i<a[f].diffs.length;i++){var l=a[f].diffs[i];l[0]!==DIFF_EQUAL&&(k=this.diff_xIndex(g,h));l[0]===
DIFF_INSERT?b=b.substring(0,j+k)+l[1]+b.substring(j+k):l[0]===DIFF_DELETE&&(b=b.substring(0,j+k)+b.substring(j+this.diff_xIndex(g,h+l[1].length)));l[0]!==DIFF_DELETE&&(h+=l[1].length)}}}b=b.substring(c.length,b.length-c.length);return[b,e]};
diff_match_patch.prototype.patch_addPadding=function(a){for(var b=this.Patch_Margin,c="",d=1;d<=b;d++)c+=String.fromCharCode(d);for(d=0;d<a.length;d++)a[d].start1+=b,a[d].start2+=b;var d=a[0],e=d.diffs;if(e.length==0||e[0][0]!=DIFF_EQUAL)e.unshift([DIFF_EQUAL,c]),d.start1-=b,d.start2-=b,d.length1+=b,d.length2+=b;else if(b>e[0][1].length){var f=b-e[0][1].length;e[0][1]=c.substring(e[0][1].length)+e[0][1];d.start1-=f;d.start2-=f;d.length1+=f;d.length2+=f}d=a[a.length-1];e=d.diffs;e.length==0||e[e.length-
1][0]!=DIFF_EQUAL?(e.push([DIFF_EQUAL,c]),d.length1+=b,d.length2+=b):b>e[e.length-1][1].length&&(f=b-e[e.length-1][1].length,e[e.length-1][1]+=c.substring(0,f),d.length1+=f,d.length2+=f);return c};
diff_match_patch.prototype.patch_splitMax=function(a){for(var b=this.Match_MaxBits,c=0;c<a.length;c++)if(a[c].length1>b){var d=a[c];a.splice(c--,1);for(var e=d.start1,f=d.start2,g="";d.diffs.length!==0;){var h=new patch_obj,j=!0;h.start1=e-g.length;h.start2=f-g.length;if(g!=="")h.length1=h.length2=g.length,h.diffs.push([DIFF_EQUAL,g]);for(;d.diffs.length!==0&&h.length1<b-this.Patch_Margin;){var g=d.diffs[0][0],i=d.diffs[0][1];g===DIFF_INSERT?(h.length2+=i.length,f+=i.length,h.diffs.push(d.diffs.shift()),
j=!1):g===DIFF_DELETE&&h.diffs.length==1&&h.diffs[0][0]==DIFF_EQUAL&&i.length>2*b?(h.length1+=i.length,e+=i.length,j=!1,h.diffs.push([g,i]),d.diffs.shift()):(i=i.substring(0,b-h.length1-this.Patch_Margin),h.length1+=i.length,e+=i.length,g===DIFF_EQUAL?(h.length2+=i.length,f+=i.length):j=!1,h.diffs.push([g,i]),i==d.diffs[0][1]?d.diffs.shift():d.diffs[0][1]=d.diffs[0][1].substring(i.length))}g=this.diff_text2(h.diffs);g=g.substring(g.length-this.Patch_Margin);i=this.diff_text1(d.diffs).substring(0,
this.Patch_Margin);i!==""&&(h.length1+=i.length,h.length2+=i.length,h.diffs.length!==0&&h.diffs[h.diffs.length-1][0]===DIFF_EQUAL?h.diffs[h.diffs.length-1][1]+=i:h.diffs.push([DIFF_EQUAL,i]));j||a.splice(++c,0,h)}}};diff_match_patch.prototype.patch_toText=function(a){for(var b=[],c=0;c<a.length;c++)b[c]=a[c];return b.join("")};
diff_match_patch.prototype.patch_fromText=function(a){var b=[];if(!a)return b;for(var a=a.split("\n"),c=0,d=/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;c<a.length;){var e=a[c].match(d);if(!e)throw Error("Invalid patch string: "+a[c]);var f=new patch_obj;b.push(f);f.start1=parseInt(e[1],10);e[2]===""?(f.start1--,f.length1=1):e[2]=="0"?f.length1=0:(f.start1--,f.length1=parseInt(e[2],10));f.start2=parseInt(e[3],10);e[4]===""?(f.start2--,f.length2=1):e[4]=="0"?f.length2=0:(f.start2--,f.length2=parseInt(e[4],
10));for(c++;c<a.length;){e=a[c].charAt(0);try{var g=decodeURI(a[c].substring(1))}catch(h){throw Error("Illegal escape in patch_fromText: "+g);}if(e=="-")f.diffs.push([DIFF_DELETE,g]);else if(e=="+")f.diffs.push([DIFF_INSERT,g]);else if(e==" ")f.diffs.push([DIFF_EQUAL,g]);else if(e=="@")break;else if(e!=="")throw Error('Invalid patch mode "'+e+'" in: '+g);c++}}return b};function patch_obj(){this.diffs=[];this.start2=this.start1=null;this.length2=this.length1=0}
patch_obj.prototype.toString=function(){for(var a=["@@ -"+(this.length1===0?this.start1+",0":this.length1==1?this.start1+1:this.start1+1+","+this.length1)+" +"+(this.length2===0?this.start2+",0":this.length2==1?this.start2+1:this.start2+1+","+this.length2)+" @@\n"],b,c=0;c<this.diffs.length;c++){switch(this.diffs[c][0]){case DIFF_INSERT:b="+";break;case DIFF_DELETE:b="-";break;case DIFF_EQUAL:b=" "}a[c+1]=b+encodeURI(this.diffs[c][1])+"\n"}return a.join("").replace(/%20/g," ")};
this.diff_match_patch=diff_match_patch;this.patch_obj=patch_obj;this.DIFF_DELETE=DIFF_DELETE;this.DIFF_INSERT=DIFF_INSERT;this.DIFF_EQUAL=DIFF_EQUAL;})();

//diff filter
function filter_content(content) {
    content = content.replace(/<\/?pre>/ig,'');
    //content = content.replace(/&lt;coding-\d+\s+lang="\w+"&gt;/ig,'[[[').replace(/&lt;\/coding(-\d+)?&gt;/ig,']]]');
    //content = content.replace(/<coding-\d+\s+lang="\w+">/ig,'[[[').replace(/<\/coding(-\d+)?>/ig,']]]');
    return content;
}

//diff 样式修复
function repair_for_shutdown(html) {
    //转义样式标签
    html = html.replace(/<(ins|del)>(\*\*|__)([^\r]*?)<\/\1>/img,
                               function(w,m1,m2,m3){
                                   if(m3) {
                                       return m2+'<'+m1+'>'+m3+'</'+m1+'>';
                                   } else {
                                       return m2;   
                                   }
                               }                                   
                               );
    html = html.replace(/<(ins|del)>\s*<\/\1>/,'');  
    
    //ins和del实体化
    html = html.replace(/<ins>/g,"{{ins}}").replace(/<\/ins>/g,'{{/ins}}');
    html = html.replace(/<del>/g,"{{del}}").replace(/<\/del>/g,'{{/del}}');    
    return html;  
}

//diff repair html
function diff_repair_html(html) {
	//补齐html标签
	var repairtag = [];
	
    html = html.replace(/{{ins}}/g,'<ins>').replace(/{{\/ins}}/g,'</ins>');
    html = html.replace(/{{del}}/g,'<del>').replace(/{{\/del}}/g,'</del>');    
	html = html.replace(/&amp;*/ig,'&');
	//alert(html);
	//html = html.replace(/<\/?pre>|<\/?code>|<\/?p>/g,'');
	html = html.replace(/<\/?pre>|<\/?code>/g,'');
	//alert(html);
	html = html.replace(/<del>[^\[\]]*?(\[|\]){3}<\/del>/ig,'');
	html = html.replace(/\[{3}/g,'<pre><code class="prettyprint">').replace(/\]{3}/g,'</code></pre>');
    //转换成html标签
    	
	html = html.replace(/<\/?ins>|<\/?del>|<\/?pre>/g,function(m){
	    return m.replace(m,'{{'+(repairtag.push(m)-1)+'}}');
	});
    //alert(repairtag);
	var len = repairtag.length;  		
	var preflag = false;
	var sufflag = false;
	for(var i in repairtag) {
	    i = parseInt(i);
	    if(i == 0 || i == len-1) {continue;}	    
	    if(!preflag) {
	       var prev = repairtag[i-1];
	       preflag = false;
	    }
	    if(!sufflag) {
	       var curr = repairtag[i];
	       sufflag = false;
	    }
	               		    
	    var next = repairtag[i+1];

	    if((curr == '<ins>' && next == '</ins>')
	       || (curr == '<del>' && next == '</del>')) {
	        continue;
	    }
	    if((prev == '<ins>' || prev == '<del>') 
	       && (curr == '<p>' || curr == '<pre>')){
	        //repairtag[i-1] = curr;
	        //repairtag[i]   = prev;	        
	        repairtag[i] = prev.replace('<','</') + curr + prev;
	        prev = curr;	        
	        preflag = true;
	    }
	    if((curr == '</p>' || curr == '</pre>')
	       && (next == '</ins>' || next == '</del>')) {
	       //repairtag[i] = next;
	       //repairtag[i+1] = curr;	
	       prev = curr;       
	       repairtag[i] = next + curr + next.replace('</','<'); 
	       preflag = true;       
	    }
	}
    //alert(repairtag);     		
	for(var j in repairtag) {
	    html = html.replace('{{'+j+'}}',repairtag[j]);
	}
	
	return html;                
}