from manim import *

class SolveSimpleEquationDivision(Scene):
    def construct(self):
        equation = MathTex("2y = 10", color=WHITE).shift(UP)
        self.play(Write(equation))
        self.wait(1)

        divide_by_2 = MathTex("\div 2", color=RED).next_to(equation, DOWN, buff=0.5)
        self.play(Write(divide_by_2))
        self.wait(0.5)
        
        arrow = Arrow(divide_by_2.get_bottom(), equation.get_bottom(), buff=0.1)
        self.play(Create(arrow))
        self.wait(0.5)

        equation_new = MathTex("y = 5", color=GREEN).next_to(divide_by_2, DOWN, buff=0.5)
        self.play(Write(equation_new))
        self.wait(2)
