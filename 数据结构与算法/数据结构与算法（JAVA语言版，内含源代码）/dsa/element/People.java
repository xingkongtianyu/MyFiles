package dsa.element;


public class People {
	private String name;
	private String id;
	
	//Constructor
	public People(){
		this("","");
	}
		
	public People(String name,String _id){
		this.name = name;
		id = _id;
	}
		
	public void sayHello(){
		System.out.println("Hello! My name is " + name);
	}
		
	public void sayHello(String name){
		System.out.println("Hello, " + name + "! My name is " + this.name);
	}
		
	//get & set methods
	public void setName(String name){
		this.name = name;
	}
	public void setId(String id){
		this.id = id;
	}
	public String getName(){
		return this.name;
	}
	public String getId(){
		return this.id;
	}
}
