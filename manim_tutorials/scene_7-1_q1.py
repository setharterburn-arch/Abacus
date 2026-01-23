from manim import *

class SolveSimpleEquation(Scene):
    def construct(self):
        equation = MathTex("x + 3 = 7", color=WHITE).shift(UP)
        self.play(Write(equation))
        self.wait(1)

        subtract_3 = MathTex("-3", color=RED).next_to(equation, DOWN, buff=0.5)
        self.play(Write(subtract_3))
        self.wait(0.5)
        
        arrow = Arrow(subtract_3.get_bottom(), equation.get_bottom(), buff=0.1)
        self.play(Create(arrow))
        self.wait(0.5)

        equation_new = MathTex("x = 4", color=GREEN).next_to(subtract_3, DOWN, buff=0.5)
        self.play(Write(equation_new))
        self.wait(2)
