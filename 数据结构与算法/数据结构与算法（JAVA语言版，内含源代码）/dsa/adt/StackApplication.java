package dsa.adt;


public class StackApplication {
	
	public static void main(String[] args) {
		StackApplication app = new StackApplication();
		app.baseConversion(2007);
		String str = "{(1.1+2)*[(2.02-2)+(3-1)]}^[(4-1)+(6-3)]";
		System.out.println("\n"+app.bracketMatch(str));
		char[][] maze = {{'1','1','1','1','1','1','1','1','1','1'},
						 {'1','0','0','1','1','1','0','0','1','1'},
						 {'1','0','0','1','1','0','0','1','0','1'},
						 {'1','0','0','0','0','0','0','1','0','1'},
						 {'1','0','0','0','0','1','1','0','0','1'},
						 {'1','0','0','1','1','1','0','0','0','1'},
						 {'1','0','0','0','0','1','0','1','0','1'},
						 {'1','0','1','1','0','0','0','1','0','1'},
						 {'1','1','0','0','0','0','1','0','0','1'},
						 {'1','1','1','1','1','1','1','1','1','1'}};
		app.mazeExit(maze,8,8,1,7);
	}
	
	public void baseConversion(int i){
		Stack s = new StackSLinked();
		while (i>0){
			s.push(i%8+"");
			i = i/8;
		}
		while (!s.isEmpty()) System.out.print((String)s.pop());
	}
	
	public boolean bracketMatch(String str) {
		Stack s = new StackSLinked();
		for (int i=0;i<str.length();i++)
		{	
 		   	char c = str.charAt(i);
    		switch (c)
    		{
        		case '{':
        		case '[':
        		case '(': s.push(Integer.valueOf(c)); break;
        		case '}':
		            if (!s.isEmpty()&& ((Integer)s.pop()).intValue()=='{')
                		break;
            		else return false;
        		case ']':
		            if (!s.isEmpty()&& ((Integer)s.pop()).intValue()=='[')
                		break;
	            	else return false;
    	    	case ')':
	            	if (!s.isEmpty()&& ((Integer)s.pop()).intValue()=='(')
	                	break;
            		else return false;
    		}
		}
		if (s.isEmpty()) return true;
		else	return false;
	}
	
	public void mazeExit(char[][] maze,int sx,int sy, int ex,int ey){
		Cell[][] cells = createMaze(maze);	//创建化迷宫
		printMaze(cells);					//打印迷宫
		Stack s = new StackSLinked();		//构造堆栈
		Cell startCell = cells[sx][sy];		//起点
		Cell endCell = cells[ex][ey];		//终点
		s.push(startCell);					//起点入栈
		startCell.visited = true;			//标记起点已被访问
		while (!s.isEmpty()){
			Cell current = (Cell)s.peek();
			if (current==endCell){	//路径找到
				while(!s.isEmpty()){
					Cell cell = (Cell)s.pop();//沿路返回将路径上的单元设为*
					cell.c = '*';
					//堆栈中与cell相邻的单元才是路径的组成部分
					//除此之外，堆栈中还有记录下来但是未继续向下探索的单元，这些单元直接出栈
					while(!s.isEmpty()&&!isAdjacentCell((Cell)s.peek(),cell)) s.pop();
				}
				System.out.println("找到从起点到终点的路径。");
				printMaze(cells);
				return;
			}
			else {	//如果当前位置不是终点
				int x = current.x;
				int y = current.y;
				int count = 0;
				if(isValidWayCell(cells[x+1][y])){	//向下
					s.push(cells[x+1][y]); cells[x+1][y].visited = true; count++;
				}
				if(isValidWayCell(cells[x][y+1])){	//向右
					s.push(cells[x][y+1]); cells[x][y+1].visited = true; count++;
				}
				if(isValidWayCell(cells[x-1][y])){	//向上
					s.push(cells[x-1][y]); cells[x-1][y].visited = true; count++;
				}
				if(isValidWayCell(cells[x][y-1])){	//向左
					s.push(cells[x][y-1]); cells[x][y-1].visited = true; count++;
				}
				if (count==0) s.pop();//如果是死点，出栈
			}
		}
		System.out.println("没有从起点到终点的路径。");
	}
	
	private void printMaze(Cell[][] cells){
		for (int x=0;x<cells.length;x++){
			for (int y=0;y<cells[x].length;y++)
				System.out.print(cells[x][y].c);
			System.out.println();
		}	
	}
	
	private boolean isAdjacentCell(Cell cell1, Cell cell2){
		if (cell1.x==cell2.x&&Math.abs(cell1.y-cell2.y)<2) return true;
		if (cell1.y==cell2.y&&Math.abs(cell1.x-cell2.x)<2) return true;
		return false;
	}
	private boolean isValidWayCell(Cell cell){
		return cell.c=='0'&&!cell.visited;
	}
	
	private Cell[][] createMaze(char[][] maze){
		Cell[][] cells = new Cell[maze.length][];
		for (int x=0;x<maze.length;x++){
			char[] row = maze[x];
			cells[x] = new Cell[row.length];
			for (int y=0; y<row.length;y++)
				cells[x][y] = new Cell(x,y,maze[x][y],false);
		}
		return cells;
	}
	private class Cell{
		int x = 0;	//单元所在行
		int y = 0;	//单元所在列
		boolean visited = false;	//是否访问过
		char c = ' ';				//是墙、可通路或起点到终点的路径
		public Cell(int x, int y, char c, boolean visited){
			this.x = x;	this.y = y;	this.c = c;	this.visited = visited;
		}
	}
}
