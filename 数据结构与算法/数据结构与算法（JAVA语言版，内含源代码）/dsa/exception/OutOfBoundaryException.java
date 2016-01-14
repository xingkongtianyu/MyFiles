package dsa.exception;

//线性表中出现序号越界时抛出该异常
public class OutOfBoundaryException extends RuntimeException{
	
	public OutOfBoundaryException(String err){
		super(err);
	}
}
