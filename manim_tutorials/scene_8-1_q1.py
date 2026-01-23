from manim import *

class SolveQuadraticEquation(Scene):
    def construct(self):
        equation = MathTex("x^2 - 9 = 0", color=WHITE).shift(UP)
        self.play(Write(equation))
        self.wait(1)

        factored = MathTex("(x - 3)(x + 3) = 0", color=YELLOW).next_to(equation, DOWN, buff=0.5)
        self.play(Write(factored))
        self.wait(1.5)

        solutions = MathTex("x = 3, x = -3", color=GREEN).next_to(factored, DOWN, buff=0.5)
        self.play(Write(solutions))
        self.wait(2)
