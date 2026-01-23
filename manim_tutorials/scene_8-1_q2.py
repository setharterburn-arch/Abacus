from manim import *

class SolveQuadraticEquationSquareRoot(Scene):
    def construct(self):
        equation = MathTex("x^2 = 16", color=WHITE).shift(UP)
        self.play(Write(equation))
        self.wait(1)

        sqrt_operation = MathTex("\sqrt{x^2} = \pm\sqrt{16}", color=YELLOW).next_to(equation, DOWN, buff=0.5)
        self.play(Write(sqrt_operation))
        self.wait(1.5)

        solutions = MathTex("x = 4, x = -4", color=GREEN).next_to(sqrt_operation, DOWN, buff=0.5)
        self.play(Write(solutions))
        self.wait(2)
