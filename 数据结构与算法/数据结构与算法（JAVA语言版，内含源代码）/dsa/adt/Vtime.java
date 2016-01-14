package dsa.adt;


public class Vtime {
	private int ve;	//最早发生时间
	private int vl;	//最迟发生时间
	//构造方法
	public Vtime() {
		this(0,Integer.MAX_VALUE);
	}
	public Vtime(int ve, int vl){
		this.ve = ve;
		this.vl = vl;
	}
	//get&set method
	public int getVE(){ return ve;}
	public int getVL(){ return vl;}
	public void setVE(int t){ ve = t;}
	public void setVL(int t){ vl = t;}
}
