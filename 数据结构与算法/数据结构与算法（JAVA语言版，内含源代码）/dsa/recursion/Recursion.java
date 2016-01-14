package dsa.recursion;

public class Recursion
{
    public static void main(String[] args)
    {
    	Recursion r = new Recursion();
        System.out.println(r.f(10));
        int[] c = new int[4];
        r.coding(c,3);
        r.hanio(5,'x','y','z');
        int[] a = {1,3,6,8,2,4,10,9,11,23,7,5};
        IntPair ip = r.simpleMinMax(a);
        System.out.println("Max=" + ip.x + " Min=" + ip.y);
        ip = r.min_max(a,0,a.length-1);
        System.out.println("Max=" + ip.x + " Min=" + ip.y);
        System.out.println("The k=8 is: " + r.selectK(a,a.length,8));
    }

    public long f(int n)
    {
        long result = 0;
        if (n==0) result = 1;
        else result = n * f(n-1);
        return result;
    }

    public void coding(int[] b,int n)
    {
        if (n==0)
        {
            b[n] = 0;outBn(b);
            b[n] = 1;outBn(b);
        }
        else
        {
            b[n] = 0; coding(b,n-1);
            b[n] = 1; coding(b,n-1);
        }
    }

    public void hanio(int n,char x,char y,char z)
    {
        if (n==1) move(x,n,z);
        else
        {
            hanio(n-1,x,z,y);
            move(x,n,z);
            hanio(n-1,y,x,z);
        }
    }
    
    public IntPair simpleMinMax(int[] a){
    	IntPair pair = new IntPair();
    	pair.x = a[0];
    	pair.y = a[0];
    	for (int i=1; i<a.length; i++){
    		if (pair.x<a[i]) pair.x = a[i];
    		if (pair.y>a[i]) pair.y = a[i];
    	}
    	return pair;
    }
    
    public IntPair min_max(int[] a, int low, int high){
    	IntPair pair = new IntPair();
    	if (low>high-2){
    		if (a[low]<a[high]){
    			pair.x = a[high]; pair.y = a[low];
    		}
    		else{
    			pair.y = a[high]; pair.x = a[low];
    		}
    	}
    	else{
    		int mid = (low + high)/2;
    		IntPair p1 = min_max(a,low,mid);
    		IntPair p2 = min_max(a,mid+1,high);
    		pair.x = p1.x>p2.x ? p1.x : p2.x;
    		pair.y = p1.y<p2.y ? p1.y : p2.y;
    	}
    	return pair;
    }
    
    public int selectK(int[] a, int n, int k){
    	if (n<10) {
    		mergeSort (a, 0, a.length-1);	//使用归并排序直接对数组a排序
    		return a[k-1];
    	}
    	int[] m = new int[n/5];
    	for (int i=0; i<n/5; i++){
    		m[i] = mid(a,5*i,5*i+4); 
    	}
    	int mm = selectK(m, m.length, (m.length+1)/2);
    	int[] a1 = new int[3*n/4];
    	int[] a3 = new int[3*n/4];
    	int r=0,s=0,t=0;
		for (int i=0;  i<n;  i++){
			if (a[i]<mm) { a1[r++] = a[i]; continue;}
			if (a[i]==mm){ s++; continue;}
			if (a[i]>mm) { a3[t++] = a[i]; continue;}
		}
		if (k<=r) return selectK (a1,r,k);
		else if (k<=r+s) return mm;
		else return selectK (a3,t,k-r-s);
    }
    
    public void mergeSort(int[] a,int low, int high){
    	if(high-low<2){
    		if(a[low]>a[high]) {
    			int temp = a[low]; 
    			a[low] = a[high]; 
    			a[high] = temp;
    		}
    		return;
    	}
    	mergeSort(a,low,(high+low)/2);
    	mergeSort(a,(high+low)/2+1,high);
    	merge(a,low,(high+low)/2,high);
    }
	
	public void merge(int[] a, int p, int q, int r){
    	int[] b = new int[r-p+1];
    	int s = p;
    	int t = q+1;
    	int k = 0;
    	while (s<=q&&t<=r)
    		if (a[s]<a[t])	b[k++] = a[s++];
    		else			b[k++] = a[t++];
    	while (s<=q) b[k++] = a[s++];
    	while (t<=r) b[k++] = a[t++];
    	for (int i=0; i<b.length; i++)
    		a[p+i] = b[i];
    }
    
	private int mid(int[] a, int low, int high){
		mergeSort(a,low,high);
		return a[(high-low)/2];
	}

    private void move(char x,int n,char y)
    {
        System.out.print("Move " + n);
        System.out.print(" from " + x);
        System.out.println(" to " + y);
    }

    private void outBn(int[] b)
    {
        for (int i=0;i<b.length;i++) System.out.print(b[i]);
        System.out.println();
    }
    
    private class IntPair
    {
    	int x;
    	int y;
    }
}